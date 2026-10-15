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

export const PART_14_SECTIONS: SectionContent[] = [
  {
    "id": "14-1-game-architecture-setup",
    "number": "14.1",
    "title": "Game Architecture & OOP Design",
    "subtitle": "Architect a scalable, object-oriented game engine using class-based entities and modular managers.",
    "readTime": "24 min",
    "objectives": [
      "Encapsulate the display, clock, and game loop inside an object-oriented Game class",
      "Design an extensible Entity base class inheriting from pygame.sprite.Sprite",
      "Implement a centralized Asset Manager to cache images and sounds efficiently",
      "Decouple game constants (dimensions, speeds, physics constants) into structured settings",
      "Manage multiple concurrent sprites cleanly with pygame.sprite.Group()",
      "Enforce separation of concerns between state updates (update) and rendering (draw)"
    ],
    "theoryBlocks": [
      {
        "heading": "The Object-Oriented Game Class",
        "text": "As game projects expand beyond simple scripts, managing global variables like `player_x`, `score`, and `running` becomes chaotic and error-prone. Professional games encapsulate the entire runtime inside an object-oriented `Game` class. The constructor `__init__()` initializes Pygame, creates the display surface, and allocates the game clock. Dedicated methods `run()`, `handle_events()`, `update()`, and `draw()` cleanly separate the stages of the game loop.",
        "codeSnippet": "import pygame\n\nclass Game:\n    def __init__(self, width=640, height=480):\n        pygame.init()\n        self.screen = pygame.display.set_mode((width, height))\n        pygame.display.set_caption(\"DO PILOT \u2014 Capstone Arcade\")\n        self.clock = pygame.time.Clock()\n        self.running = True\n        self.score = 0\n\n    def handle_events(self):\n        for event in pygame.event.get():\n            if event.type == pygame.QUIT:\n                self.running = False\n\n    def update(self, dt):\n        pass  # Update entity positions & physics\n\n    def draw(self):\n        self.screen.fill((15, 23, 42))\n        pygame.display.flip()\n\n    def run(self):\n        while self.running:\n            dt = self.clock.tick(60) / 1000.0\n            self.handle_events()\n            self.update(dt)\n            self.draw()\n        pygame.quit()",
        "terminalOutput": "Game class architecture initialized with structured run loop.",
        "tip": "Encapsulating game state inside `self` allows any entity to inspect the game session cleanly without global variables.",
        "mcq": {
          "question": "What is the primary architectural advantage of encapsulating a game inside a class (e.g. class Game:)?",
          "options": [
            {
              "id": "A",
              "text": "It bundles game state (display, clock, scores, entities) into self, eliminating spaghetti code and risky global variables",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It automatically converts Python code into C++ binaries",
              "explanationIfWrong": "Classes are standard Python OOP constructs."
            },
            {
              "id": "C",
              "text": "It doubles the maximum frame rate to 120 FPS",
              "explanationIfWrong": "Frame rate is regulated by clock.tick(), not class usage."
            },
            {
              "id": "D",
              "text": "It eliminates the need for pygame.init()",
              "explanationIfWrong": "pygame.init() is still required inside __init__."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Object-oriented encapsulation organizes state, prevents namespace pollution, and makes game logic modular and testable.",
          "id": "q-14-1-game-architecture-setup-0-v1"
        },
        "retestMcq": {
          "question": "Where should pygame.init() and pygame.display.set_mode() be called in a class-based game architecture?",
          "options": [
            {
              "id": "A",
              "text": "Inside the __init__() constructor of the main Game class",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Inside the draw() method on every frame",
              "explanationIfWrong": "Initializing on every frame causes catastrophic performance failure."
            },
            {
              "id": "C",
              "text": "In a separate thread using threading.Thread",
              "explanationIfWrong": "Pygame display operations must run on the main thread."
            },
            {
              "id": "D",
              "text": "Inside pygame.quit()",
              "explanationIfWrong": "pygame.quit() is called at shutdown."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Initialization occurs once when the Game instance is created, perfectly suited for the __init__() constructor.",
          "id": "q-14-1-game-architecture-setup-0-v2"
        },
        "questionPool": [
          {
            "question": "What is the primary architectural advantage of encapsulating a game inside a class (e.g. class Game:)?",
            "options": [
              {
                "id": "A",
                "text": "It bundles game state (display, clock, scores, entities) into self, eliminating spaghetti code and risky global variables",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It automatically converts Python code into C++ binaries",
                "explanationIfWrong": "Classes are standard Python OOP constructs."
              },
              {
                "id": "C",
                "text": "It doubles the maximum frame rate to 120 FPS",
                "explanationIfWrong": "Frame rate is regulated by clock.tick(), not class usage."
              },
              {
                "id": "D",
                "text": "It eliminates the need for pygame.init()",
                "explanationIfWrong": "pygame.init() is still required inside __init__."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Object-oriented encapsulation organizes state, prevents namespace pollution, and makes game logic modular and testable.",
            "id": "q-14-1-game-architecture-setup-0-v1"
          },
          {
            "question": "Where should pygame.init() and pygame.display.set_mode() be called in a class-based game architecture?",
            "options": [
              {
                "id": "A",
                "text": "Inside the __init__() constructor of the main Game class",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Inside the draw() method on every frame",
                "explanationIfWrong": "Initializing on every frame causes catastrophic performance failure."
              },
              {
                "id": "C",
                "text": "In a separate thread using threading.Thread",
                "explanationIfWrong": "Pygame display operations must run on the main thread."
              },
              {
                "id": "D",
                "text": "Inside pygame.quit()",
                "explanationIfWrong": "pygame.quit() is called at shutdown."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Initialization occurs once when the Game instance is created, perfectly suited for the __init__() constructor.",
            "id": "q-14-1-game-architecture-setup-0-v2"
          },
          {
            "question": "Why should dt (delta time) be passed into the update(dt) method?",
            "options": [
              {
                "id": "A",
                "text": "So all child entities and physics calculations can scale movement consistently by real elapsed time",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "To tell the entities what day of the week it is",
                "explanationIfWrong": "dt is frame duration in seconds, not calendar dates."
              },
              {
                "id": "C",
                "text": "To clear the screen surface",
                "explanationIfWrong": "screen.fill() clears surfaces."
              },
              {
                "id": "D",
                "text": "To invert the velocity vector",
                "explanationIfWrong": "Collisions invert velocity; dt scales displacement."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Passing dt into update(dt) allows every entity to compute displacement as velocity * dt for frame-rate independence.",
            "id": "q-14-1-game-architecture-setup-0-v3"
          }
        ]
      },
      {
        "heading": "Sprite Entity Hierarchy & pygame.sprite.Sprite",
        "text": "Pygame includes a built-in `pygame.sprite.Sprite` base class designed specifically for visible game objects. Subclassing `pygame.sprite.Sprite` requires two essential instance attributes: `self.image` (a `pygame.Surface` representing the graphic) and `self.rect` (a `pygame.Rect` defining spatial position and collision bounds). Entities also define an `update(dt)` method to manage custom movement.",
        "codeSnippet": "import pygame\n\nclass Entity(pygame.sprite.Sprite):\n    def __init__(self, x, y, width, height, color):\n        super().__init__()\n        # 1. Mandatory image Surface\n        self.image = pygame.Surface((width, height))\n        self.image.fill(color)\n        # 2. Mandatory rect boundary\n        self.rect = self.image.get_rect(topleft=(x, y))\n        self.velocity_x = 0\n        self.velocity_y = 0\n\n    def update(self, dt):\n        self.rect.x += int(self.velocity_x * dt)\n        self.rect.y += int(self.velocity_y * dt)\n\nclass Player(Entity):\n    def __init__(self, x, y):\n        super().__init__(x, y, 32, 48, (0, 255, 128))\n        self.speed = 250",
        "terminalOutput": "Entity hierarchy created with image Surface and rect attributes.",
        "tip": "Pygame's built-in collision and drawing tools REQUIRE your sprite classes to have `self.image` and `self.rect` attributes.",
        "mcq": {
          "question": "What two mandatory instance attributes must every subclass of pygame.sprite.Sprite possess?",
          "options": [
            {
              "id": "A",
              "text": "self.image (Surface) and self.rect (Rect)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "self.x and self.y integers",
              "explanationIfWrong": "Coordinates are managed via self.rect."
            },
            {
              "id": "C",
              "text": "self.name and self.id",
              "explanationIfWrong": "Pygame rendering engine expects image and rect."
            },
            {
              "id": "D",
              "text": "self.speed and self.health",
              "explanationIfWrong": "These are gameplay attributes, not Pygame sprite requirements."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Pygame sprite groups use sprite.image for blitting and sprite.rect for spatial positioning and collision math.",
          "id": "q-14-1-game-architecture-setup-1-v1"
        },
        "retestMcq": {
          "question": "Why must you call super().__init__() inside the constructor of a Sprite subclass?",
          "options": [
            {
              "id": "A",
              "text": "To initialize internal Pygame Sprite group tracking and membership mechanisms in the parent class",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "To load the default font",
              "explanationIfWrong": "Font loading is handled by pygame.font."
            },
            {
              "id": "C",
              "text": "To set the window size to fullscreen",
              "explanationIfWrong": "Window sizing is in pygame.display.set_mode."
            },
            {
              "id": "D",
              "text": "It is optional and can be omitted",
              "explanationIfWrong": "Omitting super().__init__() breaks sprite group functionality."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "super().__init__() initializes the Sprite base class so it can properly register with Sprite Groups.",
          "id": "q-14-1-game-architecture-setup-1-v2"
        },
        "questionPool": [
          {
            "question": "What two mandatory instance attributes must every subclass of pygame.sprite.Sprite possess?",
            "options": [
              {
                "id": "A",
                "text": "self.image (Surface) and self.rect (Rect)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "self.x and self.y integers",
                "explanationIfWrong": "Coordinates are managed via self.rect."
              },
              {
                "id": "C",
                "text": "self.name and self.id",
                "explanationIfWrong": "Pygame rendering engine expects image and rect."
              },
              {
                "id": "D",
                "text": "self.speed and self.health",
                "explanationIfWrong": "These are gameplay attributes, not Pygame sprite requirements."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Pygame sprite groups use sprite.image for blitting and sprite.rect for spatial positioning and collision math.",
            "id": "q-14-1-game-architecture-setup-1-v1"
          },
          {
            "question": "Why must you call super().__init__() inside the constructor of a Sprite subclass?",
            "options": [
              {
                "id": "A",
                "text": "To initialize internal Pygame Sprite group tracking and membership mechanisms in the parent class",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "To load the default font",
                "explanationIfWrong": "Font loading is handled by pygame.font."
              },
              {
                "id": "C",
                "text": "To set the window size to fullscreen",
                "explanationIfWrong": "Window sizing is in pygame.display.set_mode."
              },
              {
                "id": "D",
                "text": "It is optional and can be omitted",
                "explanationIfWrong": "Omitting super().__init__() breaks sprite group functionality."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "super().__init__() initializes the Sprite base class so it can properly register with Sprite Groups.",
            "id": "q-14-1-game-architecture-setup-1-v2"
          },
          {
            "question": "How do you position a sprite so that its center is at (300, 200) during initialization?",
            "options": [
              {
                "id": "A",
                "text": "self.rect = self.image.get_rect(center=(300, 200))",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "self.rect = (300, 200)",
                "explanationIfWrong": "self.rect must be a Rect object, not a coordinate tuple."
              },
              {
                "id": "C",
                "text": "self.center = (300, 200)",
                "explanationIfWrong": "Pygame reads sprite.rect, not a separate center attribute."
              },
              {
                "id": "D",
                "text": "self.image.center(300, 200)",
                "explanationIfWrong": "Surfaces do not have a .center() method."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "get_rect(center=(300, 200)) builds the bounding Rect pre-centered on the target coordinate.",
            "id": "q-14-1-game-architecture-setup-1-v3"
          }
        ]
      },
      {
        "heading": "Centralized Asset & Resource Management",
        "text": "Disk I/O is slow. If an enemy class calls `pygame.image.load('robot.png')` inside its `__init__()`, spawning 50 enemies re-reads the image file from the hard drive 50 separate times, consuming excess RAM and creating micro-stutters. A professional Asset Manager caches loaded textures, audio clips, and fonts in a dictionary, loading each file exactly once and returning cached surfaces upon subsequent requests.",
        "codeSnippet": "class AssetManager:\n    def __init__(self):\n        self._images = {}\n        self._sounds = {}\n\n    def get_image(self, path):\n        if path not in self._images:\n            # Load and convert texture once, then store in dictionary cache\n            # loaded = pygame.image.load(path).convert_alpha()\n            self._images[path] = f\"<Surface({path})>\"  # Simulated cache\n            print(f\"[AssetManager] Loaded '{path}' from disk into cache.\")\n        return self._images[path]\n\nassets = AssetManager()\nimg1 = assets.get_image(\"robot.png\")\nimg2 = assets.get_image(\"robot.png\")  # Retrieved from cache instantly!\nprint(\"Identical cache references?:\", img1 is img2)",
        "terminalOutput": "[AssetManager] Loaded 'robot.png' from disk into cache.\nIdentical cache references?: True",
        "tip": "Multiple sprites can safely share the exact same `image` Surface in memory, as long as each sprite maintains its own independent `rect` position!",
        "mcq": {
          "question": "Why is loading an image from disk inside an enemy's __init__() an anti-pattern when spawning multiple enemies?",
          "options": [
            {
              "id": "A",
              "text": "It repeatedly reads the same file from disk on every spawn, causing disk latency and wasting RAM",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Pygame crashes if image.load is called more than once",
              "explanationIfWrong": "It runs without error, but wastes memory and CPU time."
            },
            {
              "id": "C",
              "text": "The image file is deleted from disk after the first read",
              "explanationIfWrong": "File reading is non-destructive."
            },
            {
              "id": "D",
              "text": "Disk images cannot be rendered more than once",
              "explanationIfWrong": "Surfaces can be blitted infinitely."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Caching textures in an Asset Manager ensures that 100 enemies share a single in-memory Surface, saving RAM and CPU cycles.",
          "id": "q-14-1-game-architecture-setup-2-v1"
        },
        "retestMcq": {
          "question": "Can multiple independent sprite objects share the exact same self.image Surface in memory?",
          "options": [
            {
              "id": "A",
              "text": "Yes, as long as each sprite instance maintains its own distinct self.rect for positioning",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "No, Pygame requires every sprite to have a unique pixel surface",
              "explanationIfWrong": "Surfaces can be reused across thousands of sprites."
            },
            {
              "id": "C",
              "text": "Only if all sprites are located at (0, 0)",
              "explanationIfWrong": "Positions are determined by each sprite's independent rect."
            },
            {
              "id": "D",
              "text": "Only for background tiles",
              "explanationIfWrong": "Any sprites (bullets, enemies, coins) can share texture assets."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The Surface represents the visual texture; the Rect represents spatial position. Reusing textures is the standard optimization in game engines.",
          "id": "q-14-1-game-architecture-setup-2-v2"
        },
        "questionPool": [
          {
            "question": "Why is loading an image from disk inside an enemy's __init__() an anti-pattern when spawning multiple enemies?",
            "options": [
              {
                "id": "A",
                "text": "It repeatedly reads the same file from disk on every spawn, causing disk latency and wasting RAM",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Pygame crashes if image.load is called more than once",
                "explanationIfWrong": "It runs without error, but wastes memory and CPU time."
              },
              {
                "id": "C",
                "text": "The image file is deleted from disk after the first read",
                "explanationIfWrong": "File reading is non-destructive."
              },
              {
                "id": "D",
                "text": "Disk images cannot be rendered more than once",
                "explanationIfWrong": "Surfaces can be blitted infinitely."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Caching textures in an Asset Manager ensures that 100 enemies share a single in-memory Surface, saving RAM and CPU cycles.",
            "id": "q-14-1-game-architecture-setup-2-v1"
          },
          {
            "question": "Can multiple independent sprite objects share the exact same self.image Surface in memory?",
            "options": [
              {
                "id": "A",
                "text": "Yes, as long as each sprite instance maintains its own distinct self.rect for positioning",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, Pygame requires every sprite to have a unique pixel surface",
                "explanationIfWrong": "Surfaces can be reused across thousands of sprites."
              },
              {
                "id": "C",
                "text": "Only if all sprites are located at (0, 0)",
                "explanationIfWrong": "Positions are determined by each sprite's independent rect."
              },
              {
                "id": "D",
                "text": "Only for background tiles",
                "explanationIfWrong": "Any sprites (bullets, enemies, coins) can share texture assets."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The Surface represents the visual texture; the Rect represents spatial position. Reusing textures is the standard optimization in game engines.",
            "id": "q-14-1-game-architecture-setup-2-v2"
          },
          {
            "question": "What Python data structure is ideal for implementing an in-memory asset cache?",
            "options": [
              {
                "id": "A",
                "text": "A dictionary mapping file path strings to loaded Surface/Sound objects",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A linked list",
                "explanationIfWrong": "Dictionaries provide O(1) key lookups; linked lists take O(N)."
              },
              {
                "id": "C",
                "text": "A FIFO queue",
                "explanationIfWrong": "Queues discard elements after retrieval."
              },
              {
                "id": "D",
                "text": "A text file on disk",
                "explanationIfWrong": "The cache must reside in memory (RAM)."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "A dictionary gives O(1) instant lookup time: if path in cache: return cache[path].",
            "id": "q-14-1-game-architecture-setup-2-v3"
          }
        ]
      },
      {
        "heading": "Sprite Groups: pygame.sprite.Group()",
        "text": "A `pygame.sprite.Group` is a container class designed to manage collections of `Sprite` objects efficiently. Groups provide two primary powerhouse methods: 1) `group.update(*args)`: calls the `update()` method on EVERY sprite in the group with a single call; 2) `group.draw(surface)`: automatically blits every sprite's `image` to the destination surface using its `rect` position. Calling `sprite.kill()` automatically removes a sprite from all groups it belongs to.",
        "codeSnippet": "import pygame\n\npygame.init()\nscreen = pygame.display.set_mode((400, 300))\n\n# Create specialized sprite groups\nall_sprites = pygame.sprite.Group()\nenemies = pygame.sprite.Group()\ncoins = pygame.sprite.Group()\n\n# Spawning entities\n# coin = Coin(100, 200)\n# all_sprites.add(coin)\n# coins.add(coin)\n\n# Inside Game Loop:\n# all_sprites.update(dt)    # Updates every single active sprite!\n# all_sprites.draw(screen)  # Renders every single active sprite!\n\nprint(\"Sprite Groups provide batch update() and draw() capabilities.\")\npygame.quit()",
        "terminalOutput": "Sprite Groups provide batch update() and draw() capabilities.",
        "tip": "Calling `sprite.kill()` completely removes a sprite from all active groups (e.g. when an enemy is defeated or a coin collected).",
        "mcq": {
          "question": "What does all_sprites.draw(screen) do when all_sprites is a pygame.sprite.Group?",
          "options": [
            {
              "id": "A",
              "text": "It iterates through all sprites in the group and blits each sprite's .image onto screen using its .rect position",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It draws wireframe bounding boxes around all sprites",
              "explanationIfWrong": "It draws the actual sprite.image surfaces."
            },
            {
              "id": "C",
              "text": "It flips the display buffer",
              "explanationIfWrong": "pygame.display.flip() flips buffers."
            },
            {
              "id": "D",
              "text": "It updates physics positions",
              "explanationIfWrong": "group.update() handles physics; draw() handles rendering."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "group.draw() is an optimized batch renderer that blits sprite.image to screen at sprite.rect for every member.",
          "id": "q-14-1-game-architecture-setup-3-v1"
        },
        "retestMcq": {
          "question": "What does calling sprite.kill() do in Pygame?",
          "options": [
            {
              "id": "A",
              "text": "Removes the sprite from all pygame.sprite.Group instances that contain it",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Deletes the Python script from disk",
              "explanationIfWrong": "kill() only removes sprite membership from groups in memory."
            },
            {
              "id": "C",
              "text": "Closes the Pygame window",
              "explanationIfWrong": "pygame.quit() closes the window."
            },
            {
              "id": "D",
              "text": "Sets the player's score to 0",
              "explanationIfWrong": "kill() has no direct effect on score."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "sprite.kill() unregisters the sprite from all containing groups, causing it to stop updating and drawing.",
          "id": "q-14-1-game-architecture-setup-3-v2"
        },
        "questionPool": [
          {
            "question": "What does all_sprites.draw(screen) do when all_sprites is a pygame.sprite.Group?",
            "options": [
              {
                "id": "A",
                "text": "It iterates through all sprites in the group and blits each sprite's .image onto screen using its .rect position",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It draws wireframe bounding boxes around all sprites",
                "explanationIfWrong": "It draws the actual sprite.image surfaces."
              },
              {
                "id": "C",
                "text": "It flips the display buffer",
                "explanationIfWrong": "pygame.display.flip() flips buffers."
              },
              {
                "id": "D",
                "text": "It updates physics positions",
                "explanationIfWrong": "group.update() handles physics; draw() handles rendering."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "group.draw() is an optimized batch renderer that blits sprite.image to screen at sprite.rect for every member.",
            "id": "q-14-1-game-architecture-setup-3-v1"
          },
          {
            "question": "What does calling sprite.kill() do in Pygame?",
            "options": [
              {
                "id": "A",
                "text": "Removes the sprite from all pygame.sprite.Group instances that contain it",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Deletes the Python script from disk",
                "explanationIfWrong": "kill() only removes sprite membership from groups in memory."
              },
              {
                "id": "C",
                "text": "Closes the Pygame window",
                "explanationIfWrong": "pygame.quit() closes the window."
              },
              {
                "id": "D",
                "text": "Sets the player's score to 0",
                "explanationIfWrong": "kill() has no direct effect on score."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "sprite.kill() unregisters the sprite from all containing groups, causing it to stop updating and drawing.",
            "id": "q-14-1-game-architecture-setup-3-v2"
          },
          {
            "question": "Can a single Sprite belong to more than one pygame.sprite.Group at the same time?",
            "options": [
              {
                "id": "A",
                "text": "Yes, a sprite can simultaneously belong to all_sprites, enemies, and collidables groups",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "No, sprites can only belong to one group at a time",
                "explanationIfWrong": "Sprites can belong to arbitrarily many groups concurrently."
              },
              {
                "id": "C",
                "text": "Only if decorated with @multigroup",
                "explanationIfWrong": "Multi-group membership is built-in standard behavior."
              },
              {
                "id": "D",
                "text": "Only in Python 2",
                "explanationIfWrong": "Standard in all Pygame versions."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Sprites can belong to multiple groups simultaneously (e.g. all_sprites for rendering, and enemies for collision queries).",
            "id": "q-14-1-game-architecture-setup-3-v3"
          }
        ]
      },
      {
        "heading": "Configuration Decoupling: Settings Architecture",
        "text": "Hardcoding magic numbers (e.g. `480`, `250`, `0.7071`) throughout gameplay code creates brittle projects that are difficult to tune. A best practice in game development is decoupling all configuration constants into a dedicated `settings.py` module or configuration class. Screen dimensions, FPS limits, gravity forces, player speeds, file paths, and color palettes are defined once in settings and referenced throughout the codebase.",
        "codeSnippet": "# settings.py\nclass Settings:\n    SCREEN_WIDTH = 800\n    SCREEN_HEIGHT = 600\n    FPS = 60\n    TITLE = \"DO PILOT \u2014 Robot Arena 2D\"\n    \n    # Colors\n    BG_COLOR = (15, 23, 42)\n    PRIMARY_COLOR = (0, 255, 128)\n    HAZARD_COLOR = (239, 68, 68)\n    \n    # Physics Constants\n    PLAYER_SPEED = 280.0\n    ENEMY_SPEED = 140.0\n    GRAVITY = 980.0\n\nprint(\"Screen configuration:\", Settings.SCREEN_WIDTH, \"x\", Settings.SCREEN_HEIGHT)",
        "terminalOutput": "Screen configuration: 800 x 600",
        "tip": "Centralizing constants allows game designers to balance gameplay and adjust difficulty from a single file without modifying core engine logic.",
        "mcq": {
          "question": "Why should magic numbers (like hardcoded speeds and dimensions) be decoupled into a Settings configuration?",
          "options": [
            {
              "id": "A",
              "text": "It centralizes game balance and visual tuning in one place, avoiding hunting through code when adjusting speeds or dimensions",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It allows Pygame to run without a GPU",
              "explanationIfWrong": "Configuration files do not affect GPU requirements."
            },
            {
              "id": "C",
              "text": "Python raises a MagicNumberError if constants are inline",
              "explanationIfWrong": "Magic numbers run fine, but hurt maintainability."
            },
            {
              "id": "D",
              "text": "It reduces memory usage to 0 bytes",
              "explanationIfWrong": "Constants still consume memory."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Decoupling settings ensures maintainability, clean architecture, and rapid gameplay balancing.",
          "id": "q-14-1-game-architecture-setup-4-v1"
        },
        "retestMcq": {
          "question": "What is the recommended naming convention for configuration constants in Python according to PEP 8?",
          "options": [
            {
              "id": "A",
              "text": "ALL_CAPITAL_LETTERS_WITH_UNDERSCORES (e.g. SCREEN_WIDTH)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "camelCaseNaming (e.g. screenWidth)",
              "explanationIfWrong": "camelCase is Java/JavaScript convention."
            },
            {
              "id": "C",
              "text": "kebab-case-naming (e.g. screen-width)",
              "explanationIfWrong": "Hyphens are subtraction operators in Python."
            },
            {
              "id": "D",
              "text": "lowercase_with_prefix (e.g. const_screen_width)",
              "explanationIfWrong": "PEP 8 specifies uppercase constants."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "PEP 8 mandates ALL_CAPS with underscores for constants at the module or class level.",
          "id": "q-14-1-game-architecture-setup-4-v2"
        },
        "questionPool": [
          {
            "question": "Why should magic numbers (like hardcoded speeds and dimensions) be decoupled into a Settings configuration?",
            "options": [
              {
                "id": "A",
                "text": "It centralizes game balance and visual tuning in one place, avoiding hunting through code when adjusting speeds or dimensions",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It allows Pygame to run without a GPU",
                "explanationIfWrong": "Configuration files do not affect GPU requirements."
              },
              {
                "id": "C",
                "text": "Python raises a MagicNumberError if constants are inline",
                "explanationIfWrong": "Magic numbers run fine, but hurt maintainability."
              },
              {
                "id": "D",
                "text": "It reduces memory usage to 0 bytes",
                "explanationIfWrong": "Constants still consume memory."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Decoupling settings ensures maintainability, clean architecture, and rapid gameplay balancing.",
            "id": "q-14-1-game-architecture-setup-4-v1"
          },
          {
            "question": "What is the recommended naming convention for configuration constants in Python according to PEP 8?",
            "options": [
              {
                "id": "A",
                "text": "ALL_CAPITAL_LETTERS_WITH_UNDERSCORES (e.g. SCREEN_WIDTH)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "camelCaseNaming (e.g. screenWidth)",
                "explanationIfWrong": "camelCase is Java/JavaScript convention."
              },
              {
                "id": "C",
                "text": "kebab-case-naming (e.g. screen-width)",
                "explanationIfWrong": "Hyphens are subtraction operators in Python."
              },
              {
                "id": "D",
                "text": "lowercase_with_prefix (e.g. const_screen_width)",
                "explanationIfWrong": "PEP 8 specifies uppercase constants."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "PEP 8 mandates ALL_CAPS with underscores for constants at the module or class level.",
            "id": "q-14-1-game-architecture-setup-4-v2"
          },
          {
            "question": "If you want to change game resolution from 640x480 to 1280x720 across 10 files, what makes a Settings class superior?",
            "options": [
              {
                "id": "A",
                "text": "You only edit SCREEN_WIDTH and SCREEN_HEIGHT once in Settings, and all 10 files update automatically",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Settings automatically recalculates pixel DPI on monitors",
                "explanationIfWrong": "DPI is an OS hardware setting."
              },
              {
                "id": "C",
                "text": "It re-downloads the game from GitHub",
                "explanationIfWrong": "Settings is a local Python module."
              },
              {
                "id": "D",
                "text": "It converts 2D sprites into 3D meshes",
                "explanationIfWrong": "Resolution does not change dimension dimensionality."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Single Source of Truth (SSOT) prevents inconsistencies and reduces refactoring time.",
            "id": "q-14-1-game-architecture-setup-4-v3"
          }
        ]
      },
      {
        "heading": "Strict Separation of Update & Render Pipelines",
        "text": "A fundamental rule of professional game development is the strict separation between UPDATE logic (modifying data, physics, positions, collisions) and RENDER logic (drawing pixels to surfaces). Never modify game coordinates or player health inside a drawing function, and never execute `screen.blit()` or `pygame.draw` inside an `update()` method. Keeping them decoupled ensures clean multiplayer networking, headless unit testing, and predictable frame rates.",
        "codeSnippet": "# BAD: Blitting inside physics update (DO NOT DO THIS)\n# def update(self):\n#     self.x += self.speed\n#     screen.blit(self.image, (self.x, self.y))  # Mixing concerns!\n\n# GOOD: Decoupled architecture\nclass Actor:\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n        self.vx = 100.0\n\n    def update(self, dt):\n        # Pure math and state modification\n        self.x += self.vx * dt\n\n    def draw(self, surface):\n        # Pure rendering without altering state\n        surface.blit(self.image, (int(self.x), int(self.y)))",
        "terminalOutput": "Clean separation enforced: update() mutates state; draw() renders pixels.",
        "tip": "Remember: `update()` computes the simulation; `draw()` visualizes the current simulation state.",
        "mcq": {
          "question": "Why should game logic (like damage calculation or position updating) NEVER be placed inside a draw() method?",
          "options": [
            {
              "id": "A",
              "text": "Rendering code may be skipped or run at variable rates; coupling logic with drawing leads to desyncs and unpredictable bugs",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "draw() methods cannot execute addition operations",
              "explanationIfWrong": "Python can run any code, but architectural mixing is hazardous."
            },
            {
              "id": "C",
              "text": "Pygame crashes if variables are mutated inside draw()",
              "explanationIfWrong": "It does not crash immediately, but causes subtle simulation bugs."
            },
            {
              "id": "D",
              "text": "draw() is a read-only keyword in Python",
              "explanationIfWrong": "draw is simply a user-defined method name."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Separation of concerns ensures game physics remains deterministic and decoupled from rendering hardware.",
          "id": "q-14-1-game-architecture-setup-5-v1"
        },
        "retestMcq": {
          "question": "What is the sole responsibility of the draw(surface) method on a game entity?",
          "options": [
            {
              "id": "A",
              "text": "Rendering the entity's visual appearance onto the target surface based on its current position without mutating game state",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Polling keyboard events",
              "explanationIfWrong": "Event handling is done during handle_events()."
            },
            {
              "id": "C",
              "text": "Calculating collision reactions",
              "explanationIfWrong": "Collisions are calculated during update()."
            },
            {
              "id": "D",
              "text": "Playing background music",
              "explanationIfWrong": "Audio management is handled separately."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The draw method should be a pure visualization function that reads state and paints pixels without changing coordinates or stats.",
          "id": "q-14-1-game-architecture-setup-5-v2"
        },
        "questionPool": [
          {
            "question": "Why should game logic (like damage calculation or position updating) NEVER be placed inside a draw() method?",
            "options": [
              {
                "id": "A",
                "text": "Rendering code may be skipped or run at variable rates; coupling logic with drawing leads to desyncs and unpredictable bugs",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "draw() methods cannot execute addition operations",
                "explanationIfWrong": "Python can run any code, but architectural mixing is hazardous."
              },
              {
                "id": "C",
                "text": "Pygame crashes if variables are mutated inside draw()",
                "explanationIfWrong": "It does not crash immediately, but causes subtle simulation bugs."
              },
              {
                "id": "D",
                "text": "draw() is a read-only keyword in Python",
                "explanationIfWrong": "draw is simply a user-defined method name."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Separation of concerns ensures game physics remains deterministic and decoupled from rendering hardware.",
            "id": "q-14-1-game-architecture-setup-5-v1"
          },
          {
            "question": "What is the sole responsibility of the draw(surface) method on a game entity?",
            "options": [
              {
                "id": "A",
                "text": "Rendering the entity's visual appearance onto the target surface based on its current position without mutating game state",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Polling keyboard events",
                "explanationIfWrong": "Event handling is done during handle_events()."
              },
              {
                "id": "C",
                "text": "Calculating collision reactions",
                "explanationIfWrong": "Collisions are calculated during update()."
              },
              {
                "id": "D",
                "text": "Playing background music",
                "explanationIfWrong": "Audio management is handled separately."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The draw method should be a pure visualization function that reads state and paints pixels without changing coordinates or stats.",
            "id": "q-14-1-game-architecture-setup-5-v2"
          },
          {
            "question": "What is 'headless testing' in game development?",
            "options": [
              {
                "id": "A",
                "text": "Running the game loop and update(dt) simulation without opening a graphics window to verify physics and logic in automated test suites",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Playing the game with the monitor turned off",
                "explanationIfWrong": "Headless testing is an automated CI/CD software practice."
              },
              {
                "id": "C",
                "text": "Testing games without a player character sprite",
                "explanationIfWrong": "Headless means without a GUI display surface."
              },
              {
                "id": "D",
                "text": "Testing with headless robot hardware",
                "explanationIfWrong": "Headless software runs in terminal/CI environments without display drivers."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Separating update() from draw() allows automated tests to run game physics in continuous integration servers without needing a physical screen.",
            "id": "q-14-1-game-architecture-setup-5-v3"
          }
        ]
      }
    ]
  },
  {
    "id": "14-2-robot-obstacles-mechanics",
    "number": "14.2",
    "title": "Player Control, Obstacles & Movement Physics",
    "subtitle": "Implement responsive character physics, pushing interactive boxes, and boundary collision handling.",
    "readTime": "24 min",
    "objectives": [
      "Implement responsive keyboard physics with acceleration and friction damping",
      "Resolve solid wall and obstacle collisions by snapping coordinates to surface boundaries",
      "Create pushable puzzle boxes (Sokoban mechanics) responding to player contact",
      "Construct automated patrol behaviors for enemy AI robots",
      "Implement 2D platformer jump arcs and gravity physics",
      "Spawn and recycle dynamic obstacles and hazards across the game world"
    ],
    "theoryBlocks": [
      {
        "heading": "Player Acceleration & Friction Damping",
        "text": "Instantaneous movement (`if key: x += speed`) feels rigid and robotic. Modern 2D games use smooth physical acceleration and friction. When the player presses a movement key, apply acceleration: `vx += ACCEL * dt`. On every frame, apply friction damping to velocity: `vx *= FRICTION` (where `FRICTION` is a float like `0.85`). If velocity drops below a tiny threshold, clamp it to `0`. This produces organic, fluid character movement.",
        "codeSnippet": "vx = 0.0\nACCEL = 500.0\nFRICTION = 0.85\ndt = 0.0166  # ~60 FPS\n\n# Simulating pressing Right key for 3 frames, then releasing\nprint(\"--- Acceleration Phase ---\")\nfor f in range(3):\n    vx += ACCEL * dt\n    print(f\"Frame {f}: Velocity = {vx:.2f} px/s\")\n\nprint(\"--- Friction Coasting Phase ---\")\nfor f in range(3):\n    vx *= FRICTION\n    print(f\"Frame {f+3}: Coasting Velocity = {vx:.2f} px/s\")",
        "terminalOutput": "--- Acceleration Phase ---\nFrame 0: Velocity = 8.30 px/s\nFrame 1: Velocity = 16.60 px/s\nFrame 2: Velocity = 24.90 px/s\n--- Friction Coasting Phase ---\nFrame 3: Coasting Velocity = 21.17 px/s\nFrame 4: Coasting Velocity = 17.99 px/s\nFrame 5: Coasting Velocity = 15.29 px/s",
        "tip": "Friction coefficients between `0.80` and `0.90` give responsive stopping without feeling slippery like ice.",
        "mcq": {
          "question": "How does applying friction (e.g. vx *= 0.85) improve player control feel?",
          "options": [
            {
              "id": "A",
              "text": "It smooths velocity changes and causes the player to glide smoothly to a stop rather than halting abruptly",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "It permanently caps maximum speed at 0.85 pixels/sec",
              "explanationIfWrong": "Friction is a per-frame decay factor, not a static speed cap."
            },
            {
              "id": "C",
              "text": "It prevents the player from jumping",
              "explanationIfWrong": "Horizontal friction does not affect vertical jump logic."
            },
            {
              "id": "D",
              "text": "It generates heat particles automatically",
              "explanationIfWrong": "Visual particles must be coded explicitly."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Multiplying velocity by a fraction < 1.0 creates natural exponential deceleration, simulating real-world ground friction.",
          "id": "q-14-2-robot-obstacles-mechanics-0-v1"
        },
        "retestMcq": {
          "question": "What happens if the friction coefficient is set to 1.0 (vx *= 1.0)?",
          "options": [
            {
              "id": "A",
              "text": "The character never decelerates, coasting forever at constant speed (zero friction / space physics)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "The character stops instantly",
              "explanationIfWrong": "Halting instantly would occur if friction were 0.0."
            },
            {
              "id": "C",
              "text": "The game crashes with a ZeroDivisionError",
              "explanationIfWrong": "Multiplication by 1.0 is valid math."
            },
            {
              "id": "D",
              "text": "The character accelerates uncontrollably",
              "explanationIfWrong": "Acceleration requires multiplying by > 1.0."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "With friction = 1.0, velocity is never reduced, resulting in zero-friction space movement (Newton's first law).",
          "id": "q-14-2-robot-obstacles-mechanics-0-v2"
        },
        "questionPool": [
          {
            "question": "How does applying friction (e.g. vx *= 0.85) improve player control feel?",
            "options": [
              {
                "id": "A",
                "text": "It smooths velocity changes and causes the player to glide smoothly to a stop rather than halting abruptly",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It permanently caps maximum speed at 0.85 pixels/sec",
                "explanationIfWrong": "Friction is a per-frame decay factor, not a static speed cap."
              },
              {
                "id": "C",
                "text": "It prevents the player from jumping",
                "explanationIfWrong": "Horizontal friction does not affect vertical jump logic."
              },
              {
                "id": "D",
                "text": "It generates heat particles automatically",
                "explanationIfWrong": "Visual particles must be coded explicitly."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Multiplying velocity by a fraction < 1.0 creates natural exponential deceleration, simulating real-world ground friction.",
            "id": "q-14-2-robot-obstacles-mechanics-0-v1"
          },
          {
            "question": "What happens if the friction coefficient is set to 1.0 (vx *= 1.0)?",
            "options": [
              {
                "id": "A",
                "text": "The character never decelerates, coasting forever at constant speed (zero friction / space physics)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The character stops instantly",
                "explanationIfWrong": "Halting instantly would occur if friction were 0.0."
              },
              {
                "id": "C",
                "text": "The game crashes with a ZeroDivisionError",
                "explanationIfWrong": "Multiplication by 1.0 is valid math."
              },
              {
                "id": "D",
                "text": "The character accelerates uncontrollably",
                "explanationIfWrong": "Acceleration requires multiplying by > 1.0."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "With friction = 1.0, velocity is never reduced, resulting in zero-friction space movement (Newton's first law).",
            "id": "q-14-2-robot-obstacles-mechanics-0-v2"
          },
          {
            "question": "Why is clamping tiny residual velocities (e.g. if abs(vx) < 0.1: vx = 0) good practice?",
            "options": [
              {
                "id": "A",
                "text": "To prevent microscopic floating-point creeping when the player is supposed to be fully at rest",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "To prevent division by zero in Python",
                "explanationIfWrong": "Velocity is not divided by itself."
              },
              {
                "id": "C",
                "text": "To increase frame rate to 144 FPS",
                "explanationIfWrong": "Frame rate is regulated by clock.tick()."
              },
              {
                "id": "D",
                "text": "To reset the score",
                "explanationIfWrong": "Velocity clamping does not affect scores."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Repeatedly multiplying floats never reaches exact mathematical zero; clamping cuts off microscopic subpixel drifting.",
            "id": "q-14-2-robot-obstacles-mechanics-0-v3"
          }
        ]
      },
      {
        "heading": "Solid Wall Collision Resolution",
        "text": "Detecting a collision with `colliderect()` is only half the battle; resolving the collision is what stops the player from penetrating solid walls. The standard technique resolves movement along the X and Y axes SEPARATELY: 1) Move player horizontally (`rect.x += vx`), check wall collisions; if colliding, snap `rect.right = wall.left` (if moving right) or `rect.left = wall.right` (if moving left). 2) Move player vertically (`rect.y += vy`), check wall collisions; if colliding, snap `rect.bottom = wall.top` or `rect.top = wall.bottom`.",
        "codeSnippet": "# Separate Axis Collision Resolution Pattern\n# 1. Horizontal movement & resolution\nplayer.rect.x += int(player.vx * dt)\nfor wall in walls:\n    if player.rect.colliderect(wall.rect):\n        if player.vx > 0:  # Moving right\n            player.rect.right = wall.rect.left\n        elif player.vx < 0:  # Moving left\n            player.rect.left = wall.rect.right\n\n# 2. Vertical movement & resolution\nplayer.rect.y += int(player.vy * dt)\nfor wall in walls:\n    if player.rect.colliderect(wall.rect):\n        if player.vy > 0:  # Moving down\n            player.rect.bottom = wall.rect.top\n        elif player.vy < 0:  # Moving up\n            player.rect.top = wall.rect.bottom",
        "terminalOutput": "Separate-axis collision resolution eliminates corner snagging and wall clipping.",
        "tip": "Always separate X and Y collision checks! Checking both axes at once makes it impossible to know which side of the wall was struck.",
        "mcq": {
          "question": "Why must horizontal (X) and vertical (Y) movement and collision checks be resolved separately?",
          "options": [
            {
              "id": "A",
              "text": "Resolving axes independently reveals exactly which edge was collided with, allowing seamless wall sliding without corner sticking bugs",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Pygame raises an error if X and Y are updated in the same function",
              "explanationIfWrong": "No error is raised, but diagonal collision resolution becomes ambiguous."
            },
            {
              "id": "C",
              "text": "Separating axes doubles game speed",
              "explanationIfWrong": "The mathematical operations are identical in count."
            },
            {
              "id": "D",
              "text": "To allow players to phase through solid walls",
              "explanationIfWrong": "Separate resolution prevents phasing through walls."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Moving and checking X first allows snapping to left/right wall edges; moving Y next allows snapping to floor/ceiling without ambiguity.",
          "id": "q-14-2-robot-obstacles-mechanics-1-v1"
        },
        "retestMcq": {
          "question": "If a player moving right (vx > 0) collides with a solid wall, what coordinate snap stops them?",
          "options": [
            {
              "id": "A",
              "text": "player.rect.right = wall.rect.left",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "player.rect.left = wall.rect.right",
              "explanationIfWrong": "This would teleport the player through to the far side of the wall."
            },
            {
              "id": "C",
              "text": "player.rect.x = 0",
              "explanationIfWrong": "This teleports the player back to the screen edge."
            },
            {
              "id": "D",
              "text": "player.rect.top = wall.rect.bottom",
              "explanationIfWrong": "This snaps vertical coordinates, not horizontal."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Placing player.rect.right exactly against wall.rect.left prevents the player from penetrating into the wall block.",
          "id": "q-14-2-robot-obstacles-mechanics-1-v2"
        },
        "questionPool": [
          {
            "question": "Why must horizontal (X) and vertical (Y) movement and collision checks be resolved separately?",
            "options": [
              {
                "id": "A",
                "text": "Resolving axes independently reveals exactly which edge was collided with, allowing seamless wall sliding without corner sticking bugs",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Pygame raises an error if X and Y are updated in the same function",
                "explanationIfWrong": "No error is raised, but diagonal collision resolution becomes ambiguous."
              },
              {
                "id": "C",
                "text": "Separating axes doubles game speed",
                "explanationIfWrong": "The mathematical operations are identical in count."
              },
              {
                "id": "D",
                "text": "To allow players to phase through solid walls",
                "explanationIfWrong": "Separate resolution prevents phasing through walls."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Moving and checking X first allows snapping to left/right wall edges; moving Y next allows snapping to floor/ceiling without ambiguity.",
            "id": "q-14-2-robot-obstacles-mechanics-1-v1"
          },
          {
            "question": "If a player moving right (vx > 0) collides with a solid wall, what coordinate snap stops them?",
            "options": [
              {
                "id": "A",
                "text": "player.rect.right = wall.rect.left",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "player.rect.left = wall.rect.right",
                "explanationIfWrong": "This would teleport the player through to the far side of the wall."
              },
              {
                "id": "C",
                "text": "player.rect.x = 0",
                "explanationIfWrong": "This teleports the player back to the screen edge."
              },
              {
                "id": "D",
                "text": "player.rect.top = wall.rect.bottom",
                "explanationIfWrong": "This snaps vertical coordinates, not horizontal."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Placing player.rect.right exactly against wall.rect.left prevents the player from penetrating into the wall block.",
            "id": "q-14-2-robot-obstacles-mechanics-1-v2"
          },
          {
            "question": "What is 'wall sliding' in 2D games?",
            "options": [
              {
                "id": "A",
                "text": "Continuing to move smoothly along the vertical face of a wall while pressing diagonally into it",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A bug where players fall through the floor",
                "explanationIfWrong": "Wall sliding is a desirable control polish feature."
              },
              {
                "id": "C",
                "text": "Painting wall textures during runtime",
                "explanationIfWrong": "Wall sliding relates to physics and collision responses."
              },
              {
                "id": "D",
                "text": "Wall destruction mechanics",
                "explanationIfWrong": "Sliding allows fluid navigation around obstacles."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Separate-axis resolution naturally enables wall sliding: the X-axis velocity is halted against the wall, but Y-axis velocity continues unimpeded.",
            "id": "q-14-2-robot-obstacles-mechanics-1-v3"
          }
        ]
      },
      {
        "heading": "Pushable Boxes & Sokoban Puzzle Mechanics",
        "text": "Interactive environments often feature pushable boxes or crates. When the player walks into a box: 1) Check if the box can be pushed in the player's movement direction; 2) Test if pushing the box would cause it to collide with another wall or box; 3) If the destination is clear, move the box; if blocked, halt the player just like a solid wall.",
        "codeSnippet": "def try_move_box(player, box, walls, dx, dy):\n    # Simulate target box position\n    target_rect = box.rect.copy()\n    target_rect.x += dx\n    target_rect.y += dy\n    \n    # Check if target location is blocked by any solid wall\n    is_blocked = any(target_rect.colliderect(w.rect) for w in walls)\n    \n    if not is_blocked:\n        # Push box forward\n        box.rect.x += dx\n        box.rect.y += dy\n        return True  # Box pushed successfully\n    else:\n        # Box cannot move; blocks player\n        return False",
        "terminalOutput": "Box pushing algorithm verified: blocks on obstacles, shifts when clear.",
        "tip": "Using `box.rect.copy()` allows you to simulate future positions before committing the move!",
        "mcq": {
          "question": "Why is testing a hypothetical target_rect = box.rect.copy() effective before moving a pushable object?",
          "options": [
            {
              "id": "A",
              "text": "It checks if the destination is blocked by walls before mutating the real box coordinates, preventing stuck or overlapping crates",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Copying rectangles allocates new monitor pixels",
              "explanationIfWrong": "Rectangles are mathematical boundary objects in RAM."
            },
            {
              "id": "C",
              "text": "It creates a backup copy on the hard drive",
              "explanationIfWrong": "copy() creates a shallow in-memory duplicate."
            },
            {
              "id": "D",
              "text": "It deletes the original box",
              "explanationIfWrong": "copy() preserves the original unchanged."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Speculative collision checking with a cloned Rect ensures you only commit the move if the destination is completely unobstructed.",
          "id": "q-14-2-robot-obstacles-mechanics-2-v1"
        },
        "retestMcq": {
          "question": "What happens in a classic puzzle game if a box is pushed into a corner formed by two perpendicular walls?",
          "options": [
            {
              "id": "A",
              "text": "The box becomes permanently stuck because neither horizontal nor vertical pushing is unobstructed",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "The box bounces out automatically",
              "explanationIfWrong": "Boxes stay where pushed unless pulled or reset."
            },
            {
              "id": "C",
              "text": "The game crashes",
              "explanationIfWrong": "It is an intended gameplay challenge (deadlock condition)."
            },
            {
              "id": "D",
              "text": "The walls disappear",
              "explanationIfWrong": "Walls remain solid."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "In Sokoban puzzle design, cornering a crate creates an irreversible deadlock, requiring level restarts.",
          "id": "q-14-2-robot-obstacles-mechanics-2-v2"
        },
        "questionPool": [
          {
            "question": "Why is testing a hypothetical target_rect = box.rect.copy() effective before moving a pushable object?",
            "options": [
              {
                "id": "A",
                "text": "It checks if the destination is blocked by walls before mutating the real box coordinates, preventing stuck or overlapping crates",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Copying rectangles allocates new monitor pixels",
                "explanationIfWrong": "Rectangles are mathematical boundary objects in RAM."
              },
              {
                "id": "C",
                "text": "It creates a backup copy on the hard drive",
                "explanationIfWrong": "copy() creates a shallow in-memory duplicate."
              },
              {
                "id": "D",
                "text": "It deletes the original box",
                "explanationIfWrong": "copy() preserves the original unchanged."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Speculative collision checking with a cloned Rect ensures you only commit the move if the destination is completely unobstructed.",
            "id": "q-14-2-robot-obstacles-mechanics-2-v1"
          },
          {
            "question": "What happens in a classic puzzle game if a box is pushed into a corner formed by two perpendicular walls?",
            "options": [
              {
                "id": "A",
                "text": "The box becomes permanently stuck because neither horizontal nor vertical pushing is unobstructed",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The box bounces out automatically",
                "explanationIfWrong": "Boxes stay where pushed unless pulled or reset."
              },
              {
                "id": "C",
                "text": "The game crashes",
                "explanationIfWrong": "It is an intended gameplay challenge (deadlock condition)."
              },
              {
                "id": "D",
                "text": "The walls disappear",
                "explanationIfWrong": "Walls remain solid."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In Sokoban puzzle design, cornering a crate creates an irreversible deadlock, requiring level restarts.",
            "id": "q-14-2-robot-obstacles-mechanics-2-v2"
          },
          {
            "question": "How do you detect which side of a box the player contacted when attempting to push it?",
            "options": [
              {
                "id": "A",
                "text": "By inspecting the player's movement direction vector (e.g. if player.vx > 0, pushing from left to right)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "By checking the operating system clock",
                "explanationIfWrong": "Direction is derived from velocity vectors."
              },
              {
                "id": "C",
                "text": "By reading the player's color channel",
                "explanationIfWrong": "Colors have no physics information."
              },
              {
                "id": "D",
                "text": "By calling pygame.mouse.get_pressed()",
                "explanationIfWrong": "Keyboard velocity determines push direction."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The sign of the player's velocity indicates the vector of impact: vx > 0 pushes right, vx < 0 pushes left.",
            "id": "q-14-2-robot-obstacles-mechanics-2-v3"
          }
        ]
      },
      {
        "heading": "Enemy AI & Autonomous Patrol Behaviors",
        "text": "Enemies in 2D games create tension and challenge. The simplest autonomous AI is a 'Patrol Bot' that paces back and forth along a platform or between two waypoints. When the robot reaches its patrol boundary (or detects a wall collision), it reverses its velocity (`vx = -vx`) and flips its sprite image horizontally using `pygame.transform.flip(image, True, False)`.",
        "codeSnippet": "import pygame\n\nclass PatrolRobot(pygame.sprite.Sprite):\n    def __init__(self, x, y, left_bound, right_bound, speed=120):\n        super().__init__()\n        self.image = pygame.Surface((30, 30))\n        self.image.fill((255, 60, 60))\n        self.rect = self.image.get_rect(topleft=(x, y))\n        self.left_bound = left_bound\n        self.right_bound = right_bound\n        self.speed = speed\n        self.facing_right = True\n\n    def update(self, dt):\n        # Move horizontally\n        dx = self.speed * dt if self.facing_right else -self.speed * dt\n        self.rect.x += int(dx)\n        \n        # Reverse direction at boundaries\n        if self.rect.right >= self.right_bound:\n            self.facing_right = False\n        elif self.rect.left <= self.left_bound:\n            self.facing_right = True",
        "terminalOutput": "Patrol robot AI updates and reverses smoothly between waypoints.",
        "tip": "`pygame.transform.flip(surface, flip_x, flip_y)` mirrors a sprite horizontally when turning around!",
        "mcq": {
          "question": "What Pygame function mirrors a sprite image horizontally when an enemy turns around?",
          "options": [
            {
              "id": "A",
              "text": "pygame.transform.flip(surface, True, False)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "surface.reverse()",
              "explanationIfWrong": "Surfaces do not have a .reverse() method."
            },
            {
              "id": "C",
              "text": "pygame.mirror(surface)",
              "explanationIfWrong": "Image transformation functions reside in pygame.transform."
            },
            {
              "id": "D",
              "text": "pygame.draw.flip(surface)",
              "explanationIfWrong": "Transformation is in pygame.transform, not draw."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "pygame.transform.flip(surface, flip_x=True, flip_y=False) mirrors pixels horizontally across the Y axis.",
          "id": "q-14-2-robot-obstacles-mechanics-3-v1"
        },
        "retestMcq": {
          "question": "How does a simple patrol robot determine when to reverse direction?",
          "options": [
            {
              "id": "A",
              "text": "By checking if its rect position exceeds assigned left/right boundary limits or collides with an obstacle",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "By generating a random number on every millisecond",
              "explanationIfWrong": "Random direction changes cause chaotic twitching, not structured patrols."
            },
            {
              "id": "C",
              "text": "By checking if the player is jumping",
              "explanationIfWrong": "Patrols follow localized routes independently."
            },
            {
              "id": "D",
              "text": "By polling the mouse position",
              "explanationIfWrong": "Mouse input is for player control."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Waypoint boundaries or wall collisions trigger the enemy's facing direction flip.",
          "id": "q-14-2-robot-obstacles-mechanics-3-v2"
        },
        "questionPool": [
          {
            "question": "What Pygame function mirrors a sprite image horizontally when an enemy turns around?",
            "options": [
              {
                "id": "A",
                "text": "pygame.transform.flip(surface, True, False)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "surface.reverse()",
                "explanationIfWrong": "Surfaces do not have a .reverse() method."
              },
              {
                "id": "C",
                "text": "pygame.mirror(surface)",
                "explanationIfWrong": "Image transformation functions reside in pygame.transform."
              },
              {
                "id": "D",
                "text": "pygame.draw.flip(surface)",
                "explanationIfWrong": "Transformation is in pygame.transform, not draw."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "pygame.transform.flip(surface, flip_x=True, flip_y=False) mirrors pixels horizontally across the Y axis.",
            "id": "q-14-2-robot-obstacles-mechanics-3-v1"
          },
          {
            "question": "How does a simple patrol robot determine when to reverse direction?",
            "options": [
              {
                "id": "A",
                "text": "By checking if its rect position exceeds assigned left/right boundary limits or collides with an obstacle",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "By generating a random number on every millisecond",
                "explanationIfWrong": "Random direction changes cause chaotic twitching, not structured patrols."
              },
              {
                "id": "C",
                "text": "By checking if the player is jumping",
                "explanationIfWrong": "Patrols follow localized routes independently."
              },
              {
                "id": "D",
                "text": "By polling the mouse position",
                "explanationIfWrong": "Mouse input is for player control."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Waypoint boundaries or wall collisions trigger the enemy's facing direction flip.",
            "id": "q-14-2-robot-obstacles-mechanics-3-v2"
          },
          {
            "question": "How can a Chaser enemy calculate direction towards a player located at (px, py)?",
            "options": [
              {
                "id": "A",
                "text": "Subtract enemy position from player position: dx = px - ex, dy = py - ey, and normalize the vector",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Multiply enemy position by player position",
                "explanationIfWrong": "Multiplication does not yield direction vectors."
              },
              {
                "id": "C",
                "text": "Set enemy.x = px",
                "explanationIfWrong": "That teleports the enemy instantly on top of the player."
              },
              {
                "id": "D",
                "text": "Call pygame.display.update()",
                "explanationIfWrong": "display.update handles screen rendering."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Vector subtraction Target - Current gives the direction vector pointing towards the player.",
            "id": "q-14-2-robot-obstacles-mechanics-3-v3"
          }
        ]
      },
      {
        "heading": "Platformer Jump Physics & Gravity",
        "text": "Simulating a platformer jump requires applying constant downward acceleration (Gravity). On every frame, add gravity to the vertical velocity: `vy += GRAVITY * dt`. When the player presses the Jump key, they can only jump IF they are currently standing on the ground (`is_grounded == True`). Jumping sets vertical velocity to a strong negative value: `vy = -JUMP_FORCE` (negative because Y decreases upwards!). As gravity acts on `vy`, it decelerates to 0 (peak of jump) and then accelerates downwards.",
        "codeSnippet": "GRAVITY = 980.0     # Pixels per second squared downwards\nJUMP_FORCE = 450.0  # Pixels per second upwards\nvy = 0.0\nis_grounded = True\n\n# Player presses Jump key:\nif is_grounded:\n    vy = -JUMP_FORCE  # Negative Y moves UPWARD\n    is_grounded = False\n    print(\"Jump initiated! Initial upward velocity:\", vy)\n\n# Simulate 3 frames of gravity acting on airborne player:\ndt = 0.0166\nfor frame in range(3):\n    vy += GRAVITY * dt\n    print(f\"Frame {frame+1}: Vertical velocity = {vy:.2f} px/s\")",
        "terminalOutput": "Jump initiated! Initial upward velocity: -450.0\nFrame 1: Vertical velocity = -433.73 px/s\nFrame 2: Vertical velocity = -417.46 px/s\nFrame 3: Vertical velocity = -401.20 px/s",
        "tip": "Remember: UP is NEGATIVE Y in Pygame coordinates. An upward jump velocity must be a negative number!",
        "mcq": {
          "question": "Why is the initial jump velocity in Pygame a negative value (e.g. vy = -500)?",
          "options": [
            {
              "id": "A",
              "text": "Because the Y axis increases downwards in Pygame; to move upwards, Y must decrease",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Because negative numbers run faster in Python",
              "explanationIfWrong": "Sign does not affect execution speed."
            },
            {
              "id": "C",
              "text": "To prevent the player from bouncing",
              "explanationIfWrong": "Negative velocity moves the player up into the air."
            },
            {
              "id": "D",
              "text": "It is an error and should be positive",
              "explanationIfWrong": "Positive vy moves downward toward the floor."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Since Y=0 is at the top of the screen, decreasing Y moves upwards towards the ceiling.",
          "id": "q-14-2-robot-obstacles-mechanics-4-v1"
        },
        "retestMcq": {
          "question": "Why must you check 'if is_grounded:' before allowing the player to jump?",
          "options": [
            {
              "id": "A",
              "text": "To prevent infinite mid-air jumping (flappy bird effect) unless double-jump is explicitly desired",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "To prevent the ground from deleting",
              "explanationIfWrong": "Jumping does not alter floor surfaces."
            },
            {
              "id": "C",
              "text": "Because Pygame raises an error if jumping in mid-air",
              "explanationIfWrong": "No error occurs, but gameplay balance breaks."
            },
            {
              "id": "D",
              "text": "To save battery power",
              "explanationIfWrong": "Ground checking enforces platforming game rules."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Ground checks ensure that players can only jump when in contact with a solid surface below them.",
          "id": "q-14-2-robot-obstacles-mechanics-4-v2"
        },
        "questionPool": [
          {
            "question": "Why is the initial jump velocity in Pygame a negative value (e.g. vy = -500)?",
            "options": [
              {
                "id": "A",
                "text": "Because the Y axis increases downwards in Pygame; to move upwards, Y must decrease",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Because negative numbers run faster in Python",
                "explanationIfWrong": "Sign does not affect execution speed."
              },
              {
                "id": "C",
                "text": "To prevent the player from bouncing",
                "explanationIfWrong": "Negative velocity moves the player up into the air."
              },
              {
                "id": "D",
                "text": "It is an error and should be positive",
                "explanationIfWrong": "Positive vy moves downward toward the floor."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Since Y=0 is at the top of the screen, decreasing Y moves upwards towards the ceiling.",
            "id": "q-14-2-robot-obstacles-mechanics-4-v1"
          },
          {
            "question": "Why must you check 'if is_grounded:' before allowing the player to jump?",
            "options": [
              {
                "id": "A",
                "text": "To prevent infinite mid-air jumping (flappy bird effect) unless double-jump is explicitly desired",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "To prevent the ground from deleting",
                "explanationIfWrong": "Jumping does not alter floor surfaces."
              },
              {
                "id": "C",
                "text": "Because Pygame raises an error if jumping in mid-air",
                "explanationIfWrong": "No error occurs, but gameplay balance breaks."
              },
              {
                "id": "D",
                "text": "To save battery power",
                "explanationIfWrong": "Ground checking enforces platforming game rules."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Ground checks ensure that players can only jump when in contact with a solid surface below them.",
            "id": "q-14-2-robot-obstacles-mechanics-4-v2"
          },
          {
            "question": "What is the physical velocity at the exact apex (highest peak) of a jump arc?",
            "options": [
              {
                "id": "A",
                "text": "vy = 0 (the transition point between ascending and falling)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "vy = -500",
                "explanationIfWrong": "-500 is the initial takeoff speed."
              },
              {
                "id": "C",
                "text": "vy = 980",
                "explanationIfWrong": "980 is the acceleration of gravity."
              },
              {
                "id": "D",
                "text": "vy = None",
                "explanationIfWrong": "Velocity is a continuous numeric float."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "At the apex of the parabolic arc, upward velocity decelerates to exactly 0 before reversing downwards.",
            "id": "q-14-2-robot-obstacles-mechanics-4-v3"
          }
        ]
      },
      {
        "heading": "Dynamic Obstacles & Screen Wrapping vs Deletion",
        "text": "In endless arcade games (such as Asteroids, Space Invaders, or falling rock dodgers), entities constantly spawn and move across the screen. You must decide whether an entity 'wraps' or 'deletes': 1) Screen Wrapping: If an object exits the left edge (`rect.right < 0`), wrap it to the right edge (`rect.left = SCREEN_WIDTH`). 2) Off-Screen Deletion: If an object (like a laser bullet or falling hazard) leaves the screen boundary, call `sprite.kill()` immediately to prevent memory leaks and thousands of off-screen sprites hogging CPU time.",
        "codeSnippet": "SCREEN_WIDTH = 640\nSCREEN_HEIGHT = 480\n\nclass Laser(pygame.sprite.Sprite):\n    def __init__(self, x, y):\n        super().__init__()\n        self.image = pygame.Surface((4, 12))\n        self.image.fill((255, 255, 0))\n        self.rect = self.image.get_rect(center=(x, y))\n        self.speed = 600.0\n\n    def update(self, dt):\n        self.rect.y -= int(self.speed * dt)\n        # Off-Screen Deletion: destroy laser once it leaves screen top\n        if self.rect.bottom < 0:\n            self.kill()  # Completely removed from all sprite groups!\n            print(\"Laser exited screen: safely killed to prevent memory leaks.\")",
        "terminalOutput": "Laser exited screen: safely killed to prevent memory leaks.",
        "tip": "Always prune off-screen projectiles with `self.kill()`. Spawning thousands of bullets without deleting them will eventually slow your game to 5 FPS!",
        "mcq": {
          "question": "What happens if a bullet sprite moves off-screen and is NEVER removed or killed?",
          "options": [
            {
              "id": "A",
              "text": "It continues consuming CPU time and memory every frame, eventually causing severe game lag as thousands accumulate",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Pygame automatically deletes sprites that leave the window",
              "explanationIfWrong": "Pygame does NOT automatically delete off-screen sprites; you must code it."
            },
            {
              "id": "C",
              "text": "The operating system terminates the process",
              "explanationIfWrong": "Off-screen sprites exist in memory until explicitly removed."
            },
            {
              "id": "D",
              "text": "The sprite wraps to the opposite edge automatically",
              "explanationIfWrong": "Wrapping requires explicit code."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Off-screen sprites remain active in sprite groups indefinitely unless killed, wasting CPU cycles on invisible entities.",
          "id": "q-14-2-robot-obstacles-mechanics-5-v1"
        },
        "retestMcq": {
          "question": "How do you implement horizontal screen wrapping for a spaceship sprite in a window of width 800?",
          "options": [
            {
              "id": "A",
              "text": "if rect.left > 800: rect.right = 0; if rect.right < 0: rect.left = 800",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "rect.wrap(800)",
              "explanationIfWrong": "Rect objects have no .wrap() method."
            },
            {
              "id": "C",
              "text": "pygame.display.wrap(rect)",
              "explanationIfWrong": "Invalid function."
            },
            {
              "id": "D",
              "text": "rect.x = -rect.x",
              "explanationIfWrong": "Negating x mirrors position rather than wrapping across boundaries."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Checking when the full rectangle has cleared the screen edge and repositioning it to the opposite side creates smooth screen wrapping.",
          "id": "q-14-2-robot-obstacles-mechanics-5-v2"
        },
        "questionPool": [
          {
            "question": "What happens if a bullet sprite moves off-screen and is NEVER removed or killed?",
            "options": [
              {
                "id": "A",
                "text": "It continues consuming CPU time and memory every frame, eventually causing severe game lag as thousands accumulate",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Pygame automatically deletes sprites that leave the window",
                "explanationIfWrong": "Pygame does NOT automatically delete off-screen sprites; you must code it."
              },
              {
                "id": "C",
                "text": "The operating system terminates the process",
                "explanationIfWrong": "Off-screen sprites exist in memory until explicitly removed."
              },
              {
                "id": "D",
                "text": "The sprite wraps to the opposite edge automatically",
                "explanationIfWrong": "Wrapping requires explicit code."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Off-screen sprites remain active in sprite groups indefinitely unless killed, wasting CPU cycles on invisible entities.",
            "id": "q-14-2-robot-obstacles-mechanics-5-v1"
          },
          {
            "question": "How do you implement horizontal screen wrapping for a spaceship sprite in a window of width 800?",
            "options": [
              {
                "id": "A",
                "text": "if rect.left > 800: rect.right = 0; if rect.right < 0: rect.left = 800",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "rect.wrap(800)",
                "explanationIfWrong": "Rect objects have no .wrap() method."
              },
              {
                "id": "C",
                "text": "pygame.display.wrap(rect)",
                "explanationIfWrong": "Invalid function."
              },
              {
                "id": "D",
                "text": "rect.x = -rect.x",
                "explanationIfWrong": "Negating x mirrors position rather than wrapping across boundaries."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Checking when the full rectangle has cleared the screen edge and repositioning it to the opposite side creates smooth screen wrapping.",
            "id": "q-14-2-robot-obstacles-mechanics-5-v2"
          },
          {
            "question": "What condition verifies that a falling asteroid has completely passed the bottom of a 600px tall window?",
            "options": [
              {
                "id": "A",
                "text": "asteroid.rect.top > 600",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "asteroid.rect.bottom > 600",
                "explanationIfWrong": "When bottom > 600, the top half is still visible on screen."
              },
              {
                "id": "C",
                "text": "asteroid.rect.y == 0",
                "explanationIfWrong": "y == 0 is at the top of the window."
              },
              {
                "id": "D",
                "text": "asteroid.rect.centerx > 600",
                "explanationIfWrong": "centerx is horizontal, not vertical."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "When the top edge of the asteroid is greater than 600, the entire asteroid has completely cleared the bottom of the screen.",
            "id": "q-14-2-robot-obstacles-mechanics-5-v3"
          }
        ]
      }
    ]
  },
  {
    "id": "14-3-collision-rules-scoring",
    "number": "14.3",
    "title": "Win/Loss Rules, Health & Persistence",
    "subtitle": "Integrate health points, damage invulnerability cooldowns, game-over conditions, and persistent high scores.",
    "readTime": "24 min",
    "objectives": [
      "Detect sprite-to-group collisions with pygame.sprite.spritecollide(sprite, group, dokill)",
      "Implement player health systems with temporary invulnerability cooldowns (i-frames)",
      "Render real-time score counters, combo multipliers, and health bars",
      "Manage clear game-over conditions and victory states",
      "Persist and load high-score leaderboards using standard JSON file I/O",
      "Integrate sound effects and background music using pygame.mixer"
    ],
    "theoryBlocks": [
      {
        "heading": "Group Collisions with pygame.sprite.spritecollide()",
        "text": "When testing collisions between a single sprite (like the player) and an entire group of sprites (like coins or enemies), use `pygame.sprite.spritecollide(sprite, group, dokill)`. It returns a list of all sprites in `group` that intersect with `sprite`. If the `dokill` parameter is set to `True`, any colliding sprites in the group are automatically killed (`.kill()`) and removed from all sprite groups immediately!",
        "codeSnippet": "import pygame\n\n# In your game loop update:\n# 1. Collect coins: dokill=True automatically destroys collected coins!\n# collected_coins = pygame.sprite.spritecollide(player, coin_group, dokill=True)\n# for coin in collected_coins:\n#     score += 10\n#     coin_sound.play()\n\n# 2. Check enemy hits: dokill=False keeps enemy alive to damage player again\n# hit_enemies = pygame.sprite.spritecollide(player, enemy_group, dokill=False)\n# if hit_enemies:\n#     player.take_damage(20)",
        "terminalOutput": "spritecollide() efficiently queries group collisions and supports auto-kill.",
        "tip": "Set `dokill=True` for collectibles and consumed bullets; set `dokill=False` for enemies and static obstacles.",
        "mcq": {
          "question": "What happens when dokill=True in pygame.sprite.spritecollide(player, coins, dokill=True)?",
          "options": [
            {
              "id": "A",
              "text": "Any coin that collided with the player is automatically removed (.kill()) from all containing sprite groups",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "The player sprite is deleted",
              "explanationIfWrong": "The dokill flag applies to the group members, not the target sprite."
            },
            {
              "id": "C",
              "text": "The game exits immediately",
              "explanationIfWrong": "dokill manages sprite removal, not game termination."
            },
            {
              "id": "D",
              "text": "All coins on the entire screen are deleted",
              "explanationIfWrong": "Only coins that actually collided are killed."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "dokill=True executes sprite.kill() on every colliding member of the group, perfect for collecting items.",
          "id": "q-14-3-collision-rules-scoring-0-v1"
        },
        "retestMcq": {
          "question": "What does pygame.sprite.spritecollide() return?",
          "options": [
            {
              "id": "A",
              "text": "A list containing all sprites in the group that collided with the target sprite (empty list if no collisions)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "A boolean True or False",
              "explanationIfWrong": "It returns a list of the colliding sprite instances."
            },
            {
              "id": "C",
              "text": "An integer count of collisions",
              "explanationIfWrong": "It returns the list itself; use len() on the list to count."
            },
            {
              "id": "D",
              "text": "The coordinates of the collision",
              "explanationIfWrong": "It returns sprite objects."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "spritecollide returns a list of colliding sprites, enabling custom actions (e.g. adding score, checking enemy types).",
          "id": "q-14-3-collision-rules-scoring-0-v2"
        },
        "questionPool": [
          {
            "question": "What happens when dokill=True in pygame.sprite.spritecollide(player, coins, dokill=True)?",
            "options": [
              {
                "id": "A",
                "text": "Any coin that collided with the player is automatically removed (.kill()) from all containing sprite groups",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The player sprite is deleted",
                "explanationIfWrong": "The dokill flag applies to the group members, not the target sprite."
              },
              {
                "id": "C",
                "text": "The game exits immediately",
                "explanationIfWrong": "dokill manages sprite removal, not game termination."
              },
              {
                "id": "D",
                "text": "All coins on the entire screen are deleted",
                "explanationIfWrong": "Only coins that actually collided are killed."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "dokill=True executes sprite.kill() on every colliding member of the group, perfect for collecting items.",
            "id": "q-14-3-collision-rules-scoring-0-v1"
          },
          {
            "question": "What does pygame.sprite.spritecollide() return?",
            "options": [
              {
                "id": "A",
                "text": "A list containing all sprites in the group that collided with the target sprite (empty list if no collisions)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "A boolean True or False",
                "explanationIfWrong": "It returns a list of the colliding sprite instances."
              },
              {
                "id": "C",
                "text": "An integer count of collisions",
                "explanationIfWrong": "It returns the list itself; use len() on the list to count."
              },
              {
                "id": "D",
                "text": "The coordinates of the collision",
                "explanationIfWrong": "It returns sprite objects."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "spritecollide returns a list of colliding sprites, enabling custom actions (e.g. adding score, checking enemy types).",
            "id": "q-14-3-collision-rules-scoring-0-v2"
          },
          {
            "question": "What function checks collisions between two entire GROUPS (e.g. bullets_group and enemies_group)?",
            "options": [
              {
                "id": "A",
                "text": "pygame.sprite.groupcollide(group1, group2, dokill1, dokill2)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "pygame.sprite.spritecollide()",
                "explanationIfWrong": "spritecollide is for 1 sprite against a group."
              },
              {
                "id": "C",
                "text": "pygame.all_collide()",
                "explanationIfWrong": "The function is groupcollide."
              },
              {
                "id": "D",
                "text": "group1.colliderect(group2)",
                "explanationIfWrong": "Groups do not have colliderect methods."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "groupcollide() checks collisions between two entire groups, with independent dokill flags for each group.",
            "id": "q-14-3-collision-rules-scoring-0-v3"
          }
        ]
      },
      {
        "heading": "Health Systems & Invulnerability Frames (i-frames)",
        "text": "If a player collides with an enemy without invulnerability frames, the collision check runs 60 times per second, obliterating 100 HP in less than 2 frames! Professional games grant temporary 'invulnerability frames' (i-frames): when damaged, store an invincibility timer (e.g. `invincible_timer = 1.0` second). While `invincible_timer > 0`, the player ignores enemy damage. Visual feedback (such as flashing the sprite opacity) signals invulnerability to the player.",
        "codeSnippet": "class Player(pygame.sprite.Sprite):\n    def __init__(self):\n        super().__init__()\n        self.health = 100\n        self.invincible_timer = 0.0\n\n    def take_damage(self, amount):\n        # Ignore damage if currently in invulnerability cooldown\n        if self.invincible_timer <= 0:\n            self.health -= amount\n            self.invincible_timer = 1.0  # 1 second of i-frames\n            print(f\"Player damaged! Health: {self.health}, i-frames activated.\")\n\n    def update(self, dt):\n        if self.invincible_timer > 0:\n            self.invincible_timer -= dt",
        "terminalOutput": "Player damaged! Health: 80, i-frames activated.",
        "tip": "i-frames turn frustrating multi-hit insta-deaths into fair, readable combat encounters.",
        "mcq": {
          "question": "Why are Invulnerability Frames (i-frames) necessary in real-time games?",
          "options": [
            {
              "id": "A",
              "text": "To prevent a single enemy collision from dealing damage 60 times per second, allowing the player time to recover",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "To increase the frame rate to 120 FPS",
              "explanationIfWrong": "i-frames are gameplay timers, not graphics render clocks."
            },
            {
              "id": "C",
              "text": "To disable gravity permanently",
              "explanationIfWrong": "Gravity continues normally during i-frames."
            },
            {
              "id": "D",
              "text": "To hide the player from the camera",
              "explanationIfWrong": "Players usually flash or blink to indicate temporary invincibility."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Without i-frames, contact with an enemy damages the player on every single frame (~60 times a second), causing instant death.",
          "id": "q-14-3-collision-rules-scoring-1-v1"
        },
        "retestMcq": {
          "question": "How should an invulnerability timer be updated each frame?",
          "options": [
            {
              "id": "A",
              "text": "invincible_timer -= dt (decrease by elapsed delta time until <= 0)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "invincible_timer = 0",
              "explanationIfWrong": "Resetting immediately disables i-frames on the next frame."
            },
            {
              "id": "C",
              "text": "invincible_timer += 1",
              "explanationIfWrong": "Incrementing would make the player invulnerable forever."
            },
            {
              "id": "D",
              "text": "invincible_timer = clock.get_fps()",
              "explanationIfWrong": "FPS is frame rate, not a cooldown timer."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Subtracting delta time counts down real elapsed seconds until the cooldown expires.",
          "id": "q-14-3-collision-rules-scoring-1-v2"
        },
        "questionPool": [
          {
            "question": "Why are Invulnerability Frames (i-frames) necessary in real-time games?",
            "options": [
              {
                "id": "A",
                "text": "To prevent a single enemy collision from dealing damage 60 times per second, allowing the player time to recover",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "To increase the frame rate to 120 FPS",
                "explanationIfWrong": "i-frames are gameplay timers, not graphics render clocks."
              },
              {
                "id": "C",
                "text": "To disable gravity permanently",
                "explanationIfWrong": "Gravity continues normally during i-frames."
              },
              {
                "id": "D",
                "text": "To hide the player from the camera",
                "explanationIfWrong": "Players usually flash or blink to indicate temporary invincibility."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Without i-frames, contact with an enemy damages the player on every single frame (~60 times a second), causing instant death.",
            "id": "q-14-3-collision-rules-scoring-1-v1"
          },
          {
            "question": "How should an invulnerability timer be updated each frame?",
            "options": [
              {
                "id": "A",
                "text": "invincible_timer -= dt (decrease by elapsed delta time until <= 0)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "invincible_timer = 0",
                "explanationIfWrong": "Resetting immediately disables i-frames on the next frame."
              },
              {
                "id": "C",
                "text": "invincible_timer += 1",
                "explanationIfWrong": "Incrementing would make the player invulnerable forever."
              },
              {
                "id": "D",
                "text": "invincible_timer = clock.get_fps()",
                "explanationIfWrong": "FPS is frame rate, not a cooldown timer."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Subtracting delta time counts down real elapsed seconds until the cooldown expires.",
            "id": "q-14-3-collision-rules-scoring-1-v2"
          },
          {
            "question": "How is temporary invulnerability commonly communicated visually to the player?",
            "options": [
              {
                "id": "A",
                "text": "By rapidly flashing or blinking the sprite's visibility or transparency",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "By turning off the computer monitor",
                "explanationIfWrong": "Visual feedback happens on-screen."
              },
              {
                "id": "C",
                "text": "By freezing the entire game for 5 seconds",
                "explanationIfWrong": "Gameplay continues while the player blinks."
              },
              {
                "id": "D",
                "text": "By inverting all colors in the operating system",
                "explanationIfWrong": "Visual cues are contained to the sprite."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Rapidly toggling sprite visibility on and off (flashing) is the universal video game visual indicator of i-frames.",
            "id": "q-14-3-collision-rules-scoring-1-v3"
          }
        ]
      },
      {
        "heading": "Score Tracking & Heads-Up Display (HUD)",
        "text": "The Heads-Up Display (HUD) communicates game statistics to the player. Rendering text requires 3 steps: 1) Initialize a font with `font = pygame.font.SysFont('Arial', 24)`; 2) Render the text string into a Surface with `surf = font.render(f'Score: {score}', True, COLOR)`; 3) Blit the rendered text Surface onto the screen at the desired coordinates. You can also draw visual health bars using `pygame.draw.rect()`.",
        "codeSnippet": "import pygame\n\npygame.init()\nfont = pygame.font.SysFont(\"Arial\", 22, bold=True)\n\ndef draw_hud(screen, score, health):\n    # 1. Render score text in top-left corner\n    score_surf = font.render(f\"Score: {score:05d}\", True, (255, 255, 255))\n    screen.blit(score_surf, (20, 20))\n    \n    # 2. Draw Health Bar in top-right corner\n    # Background red bar (max HP)\n    pygame.draw.rect(screen, (100, 20, 20), (460, 20, 160, 20))\n    # Foreground green bar (current HP)\n    current_width = int(160 * (max(0, health) / 100.0))\n    pygame.draw.rect(screen, (0, 255, 128), (460, 20, current_width, 20))\n\nprint(\"HUD drawing function compiled successfully.\")\npygame.quit()",
        "terminalOutput": "HUD drawing function compiled successfully.",
        "tip": "Formatting scores with leading zeros (e.g. `f'{score:05d}'` -> `00250`) gives an authentic retro arcade aesthetic.",
        "mcq": {
          "question": "What is the formula to calculate the width of a health bar representing current health out of max_health on a bar of max_width pixels?",
          "options": [
            {
              "id": "A",
              "text": "int(max_width * (health / max_health))",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "int(max_width + health)",
              "explanationIfWrong": "Health bars require ratio multiplication, not addition."
            },
            {
              "id": "C",
              "text": "int(max_health / health)",
              "explanationIfWrong": "This is inverted and would cause division by zero."
            },
            {
              "id": "D",
              "text": "int(max_width - health)",
              "explanationIfWrong": "Subtraction does not scale proportionally."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Multiplying the total pixel width by the health ratio (health / max_health) accurately scales the bar length.",
          "id": "q-14-3-collision-rules-scoring-2-v1"
        },
        "retestMcq": {
          "question": "What does f'{score:06d}' format the number 42 into?",
          "options": [
            {
              "id": "A",
              "text": "'000042' (padded with leading zeros to 6 digits)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "'420000'",
              "explanationIfWrong": "Padding is added to the left (leading), not trailing."
            },
            {
              "id": "C",
              "text": "'42.000000'",
              "explanationIfWrong": "'d' format is integer, not floating-point decimal."
            },
            {
              "id": "D",
              "text": "'42'",
              "explanationIfWrong": "The 06 specifier pads up to 6 characters."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": ":06d pads the integer with leading zeros until the total string length is 6 characters.",
          "id": "q-14-3-collision-rules-scoring-2-v2"
        },
        "questionPool": [
          {
            "question": "What is the formula to calculate the width of a health bar representing current health out of max_health on a bar of max_width pixels?",
            "options": [
              {
                "id": "A",
                "text": "int(max_width * (health / max_health))",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "int(max_width + health)",
                "explanationIfWrong": "Health bars require ratio multiplication, not addition."
              },
              {
                "id": "C",
                "text": "int(max_health / health)",
                "explanationIfWrong": "This is inverted and would cause division by zero."
              },
              {
                "id": "D",
                "text": "int(max_width - health)",
                "explanationIfWrong": "Subtraction does not scale proportionally."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Multiplying the total pixel width by the health ratio (health / max_health) accurately scales the bar length.",
            "id": "q-14-3-collision-rules-scoring-2-v1"
          },
          {
            "question": "What does f'{score:06d}' format the number 42 into?",
            "options": [
              {
                "id": "A",
                "text": "'000042' (padded with leading zeros to 6 digits)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "'420000'",
                "explanationIfWrong": "Padding is added to the left (leading), not trailing."
              },
              {
                "id": "C",
                "text": "'42.000000'",
                "explanationIfWrong": "'d' format is integer, not floating-point decimal."
              },
              {
                "id": "D",
                "text": "'42'",
                "explanationIfWrong": "The 06 specifier pads up to 6 characters."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": ":06d pads the integer with leading zeros until the total string length is 6 characters.",
            "id": "q-14-3-collision-rules-scoring-2-v2"
          },
          {
            "question": "Where should the HUD be drawn relative to other game elements in the render phase?",
            "options": [
              {
                "id": "A",
                "text": "At the very end of the draw phase, on top of all background tiles, sprites, and particle effects",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "First, before the background is filled",
                "explanationIfWrong": "Drawing before background.fill() would immediately erase the HUD."
              },
              {
                "id": "C",
                "text": "Inside the player's update() method",
                "explanationIfWrong": "HUD is visual rendering, not physics update."
              },
              {
                "id": "D",
                "text": "Only when the game is paused",
                "explanationIfWrong": "HUD stats should be visible during active gameplay."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Rendering layers from back to front (Painter's Algorithm): Background -> Game Sprites -> Foreground HUD overlay.",
            "id": "q-14-3-collision-rules-scoring-2-v3"
          }
        ]
      },
      {
        "heading": "Persistent High Scores with JSON Storage",
        "text": "An arcade game isn't complete without persistent high scores. Using Python's built-in `json` module, save the player's best score to a local file (`high_scores.json`). When the game launches, load the file into memory. If the player achieves a new record, update the value and write it back to disk with `json.dump()`. Always wrap file I/O in `try-except` blocks to handle missing or corrupt files gracefully.",
        "codeSnippet": "import json\nimport os\n\nSCORE_FILE = \"high_score.json\"\n\ndef load_high_score():\n    if os.path.exists(SCORE_FILE):\n        try:\n            with open(SCORE_FILE, \"r\") as f:\n                data = json.load(f)\n                return data.get(\"high_score\", 0)\n        except (json.JSONDecodeError, IOError):\n            return 0\n    return 0\n\ndef save_high_score(score):\n    try:\n        with open(SCORE_FILE, \"w\") as f:\n            json.dump({\"high_score\": score}, f, indent=2)\n    except IOError as e:\n        print(\"Failed to save score:\", e)\n\nsave_high_score(2450)\nprint(\"Loaded high score from disk:\", load_high_score())",
        "terminalOutput": "Loaded high score from disk: 2450",
        "tip": "Handling `FileNotFoundError` or `JSONDecodeError` ensures that a fresh install starts with a default score of 0 without crashing.",
        "mcq": {
          "question": "Why is JSON preferred over plain text for saving game state and high scores in Python?",
          "options": [
            {
              "id": "A",
              "text": "JSON natively serializes structured data (dictionaries, lists, numbers, strings) and parses directly into Python types",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "JSON files cannot be opened by text editors",
              "explanationIfWrong": "JSON is plain human-readable text."
            },
            {
              "id": "C",
              "text": "JSON runs on the GPU",
              "explanationIfWrong": "JSON is a file data format."
            },
            {
              "id": "D",
              "text": "JSON automatically encrypts data with 256-bit AES",
              "explanationIfWrong": "Standard JSON is unencrypted."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "JSON serializes complex Python dictionaries and lists cleanly into human-readable, cross-platform files.",
          "id": "q-14-3-collision-rules-scoring-3-v1"
        },
        "retestMcq": {
          "question": "What Python context manager ensures a save file is closed properly even if an exception occurs during writing?",
          "options": [
            {
              "id": "A",
              "text": "with open(filename, 'w') as f:",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "file.save()",
              "explanationIfWrong": "The standard Python construct is the with statement."
            },
            {
              "id": "C",
              "text": "try open(filename)",
              "explanationIfWrong": "The keyword is 'with'."
            },
            {
              "id": "D",
              "text": "pygame.file.open()",
              "explanationIfWrong": "Pygame relies on Python's built-in open() function."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "The 'with open(...)' context manager automatically flushes and closes file descriptors upon exit.",
          "id": "q-14-3-collision-rules-scoring-3-v2"
        },
        "questionPool": [
          {
            "question": "Why is JSON preferred over plain text for saving game state and high scores in Python?",
            "options": [
              {
                "id": "A",
                "text": "JSON natively serializes structured data (dictionaries, lists, numbers, strings) and parses directly into Python types",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "JSON files cannot be opened by text editors",
                "explanationIfWrong": "JSON is plain human-readable text."
              },
              {
                "id": "C",
                "text": "JSON runs on the GPU",
                "explanationIfWrong": "JSON is a file data format."
              },
              {
                "id": "D",
                "text": "JSON automatically encrypts data with 256-bit AES",
                "explanationIfWrong": "Standard JSON is unencrypted."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "JSON serializes complex Python dictionaries and lists cleanly into human-readable, cross-platform files.",
            "id": "q-14-3-collision-rules-scoring-3-v1"
          },
          {
            "question": "What Python context manager ensures a save file is closed properly even if an exception occurs during writing?",
            "options": [
              {
                "id": "A",
                "text": "with open(filename, 'w') as f:",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "file.save()",
                "explanationIfWrong": "The standard Python construct is the with statement."
              },
              {
                "id": "C",
                "text": "try open(filename)",
                "explanationIfWrong": "The keyword is 'with'."
              },
              {
                "id": "D",
                "text": "pygame.file.open()",
                "explanationIfWrong": "Pygame relies on Python's built-in open() function."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The 'with open(...)' context manager automatically flushes and closes file descriptors upon exit.",
            "id": "q-14-3-collision-rules-scoring-3-v2"
          },
          {
            "question": "What happens if load_high_score() runs on a machine that has never played the game before?",
            "options": [
              {
                "id": "A",
                "text": "It checks if the file exists (or catches FileNotFoundError) and safely returns a default score of 0",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The entire operating system crashes",
                "explanationIfWrong": "Proper exception handling prevents app crashes."
              },
              {
                "id": "C",
                "text": "The player is given 999999 points",
                "explanationIfWrong": "Default initial score is 0."
              },
              {
                "id": "D",
                "text": "Pygame refuses to open the window",
                "explanationIfWrong": "File loading is independent of display setup."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Defensive programming with os.path.exists() or try/except ensures clean initialization on first run.",
            "id": "q-14-3-collision-rules-scoring-3-v3"
          }
        ]
      },
      {
        "heading": "Audio Architecture: Sound Effects & Music",
        "text": "Audio breathes life into games. Pygame separates audio into two distinct systems via `pygame.mixer`: 1) Sound Effects (`pygame.mixer.Sound('laser.wav')`): Short, pre-loaded audio clips played with `sound.play()`. Multiple sound effects can overlap simultaneously (e.g. explosions during gunfire). 2) Background Music (`pygame.mixer.music`): Long audio streams (OGG, MP3) streamed from disk without hogging RAM. Load with `pygame.mixer.music.load('theme.ogg')` and loop continuously with `pygame.mixer.music.play(-1)`.",
        "codeSnippet": "import pygame\n\n# Initialize audio subsystem\npygame.mixer.init()\n\n# 1. Short sound effect (buffered in RAM)\n# jump_sfx = pygame.mixer.Sound(\"jump.wav\")\n# jump_sfx.set_volume(0.6)\n# jump_sfx.play()\n\n# 2. Background music (streamed from disk)\n# pygame.mixer.music.load(\"soundtrack.ogg\")\n# pygame.mixer.music.set_volume(0.4)\n# pygame.mixer.music.play(loops=-1)  # -1 means loop indefinitely!\n\nprint(\"Pygame mixer architecture: Sound for SFX, music for streaming.\")\npygame.quit()",
        "terminalOutput": "Pygame mixer architecture: Sound for SFX, music for streaming.",
        "tip": "Passing `loops=-1` to `pygame.mixer.music.play(-1)` causes the background track to loop endlessly!",
        "mcq": {
          "question": "What is the primary architectural difference between pygame.mixer.Sound and pygame.mixer.music?",
          "options": [
            {
              "id": "A",
              "text": "Sound preloads short audio clips into RAM for instant low-latency playback; music streams long tracks directly from disk to conserve memory",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Sound is only for mono audio; music is for stereo",
              "explanationIfWrong": "Both support stereo audio."
            },
            {
              "id": "C",
              "text": "Sound is 8-bit; music is 64-bit",
              "explanationIfWrong": "Bit depth is configured in mixer settings."
            },
            {
              "id": "D",
              "text": "There is no difference; they are aliases",
              "explanationIfWrong": "They utilize fundamentally different memory management models."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Sound objects reside fully in memory for instant concurrent firing. Music streams progressively from storage.",
          "id": "q-14-3-collision-rules-scoring-4-v1"
        },
        "retestMcq": {
          "question": "What argument must be passed to pygame.mixer.music.play() to loop background music indefinitely?",
          "options": [
            {
              "id": "A",
              "text": "loops=-1",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "loop=True",
              "explanationIfWrong": "Pygame expects integer count; -1 is infinite."
            },
            {
              "id": "C",
              "text": "repeat='forever'",
              "explanationIfWrong": "String parameters are not accepted."
            },
            {
              "id": "D",
              "text": "count=0",
              "explanationIfWrong": "count=0 plays the track exactly once with 0 loops."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "In Pygame, passing loops=-1 instructs the audio mixer to repeat the music track continuously.",
          "id": "q-14-3-collision-rules-scoring-4-v2"
        },
        "questionPool": [
          {
            "question": "What is the primary architectural difference between pygame.mixer.Sound and pygame.mixer.music?",
            "options": [
              {
                "id": "A",
                "text": "Sound preloads short audio clips into RAM for instant low-latency playback; music streams long tracks directly from disk to conserve memory",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Sound is only for mono audio; music is for stereo",
                "explanationIfWrong": "Both support stereo audio."
              },
              {
                "id": "C",
                "text": "Sound is 8-bit; music is 64-bit",
                "explanationIfWrong": "Bit depth is configured in mixer settings."
              },
              {
                "id": "D",
                "text": "There is no difference; they are aliases",
                "explanationIfWrong": "They utilize fundamentally different memory management models."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Sound objects reside fully in memory for instant concurrent firing. Music streams progressively from storage.",
            "id": "q-14-3-collision-rules-scoring-4-v1"
          },
          {
            "question": "What argument must be passed to pygame.mixer.music.play() to loop background music indefinitely?",
            "options": [
              {
                "id": "A",
                "text": "loops=-1",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "loop=True",
                "explanationIfWrong": "Pygame expects integer count; -1 is infinite."
              },
              {
                "id": "C",
                "text": "repeat='forever'",
                "explanationIfWrong": "String parameters are not accepted."
              },
              {
                "id": "D",
                "text": "count=0",
                "explanationIfWrong": "count=0 plays the track exactly once with 0 loops."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "In Pygame, passing loops=-1 instructs the audio mixer to repeat the music track continuously.",
            "id": "q-14-3-collision-rules-scoring-4-v2"
          },
          {
            "question": "How do you adjust the volume of a sound effect to 50%?",
            "options": [
              {
                "id": "A",
                "text": "sound.set_volume(0.5)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "sound.volume = 50",
                "explanationIfWrong": "Pygame uses the set_volume() method with floats 0.0 to 1.0."
              },
              {
                "id": "C",
                "text": "sound.set_gain(-6dB)",
                "explanationIfWrong": "Volume is set via float scale, not decibels."
              },
              {
                "id": "D",
                "text": "pygame.mixer.set_volume(50)",
                "explanationIfWrong": "Volume is adjusted per sound instance or globally via mixer."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "set_volume() accepts a float from 0.0 (silent) to 1.0 (full volume).",
            "id": "q-14-3-collision-rules-scoring-4-v3"
          }
        ]
      },
      {
        "heading": "Game Over & Victory State Transitions",
        "text": "Managing distinct gameplay phases requires robust finite state machines. When a victory condition is fulfilled (such as clearing all waves or crossing the finish line), or a loss condition triggers (depleted health), the game loops transitions out of 'PLAYING'. A dedicated state controller disables world updates, renders victory or defeat overlays with high-contrast banners, calculates bonus multipliers, and listens for restart or level-progression commands.",
        "codeSnippet": "class GameState:\n    PLAYING = 'playing'\n    GAME_OVER = 'game_over'\n    VICTORY = 'victory'\n\n# In main update method:\nif self.state == GameState.PLAYING:\n    self.all_sprites.update()\n    if self.player.health <= 0:\n        self.state = GameState.GAME_OVER\n        self.sound_manager.play('game_over')\n    elif len(self.enemies) == 0:\n        self.state = GameState.VICTORY\n        self.sound_manager.play('victory')",
        "terminalOutput": "Game state transitioned: PLAYING -> VICTORY (Score: 12500)",
        "tip": "Keep state handling centralized in the main Game class so individual sprites do not trigger window exits directly.",
        "mcq": {
          "question": "What is the primary advantage of modeling game flow as a Finite State Machine (FSM)?",
          "options": [
            { "id": "A", "text": "It cleanly isolates update/render logic and eliminates messy boolean flags like is_paused, is_dead, is_menu", "explanationIfWrong": "This is the correct answer." },
            { "id": "B", "text": "It automatically converts 2D sprites into 3D models", "explanationIfWrong": "FSM is software architecture, not 3D rendering." },
            { "id": "C", "text": "It forces the GPU to run at maximum clock speed", "explanationIfWrong": "FSM does not overclock hardware." },
            { "id": "D", "text": "It bypasses Python memory management", "explanationIfWrong": "Python memory management remains intact." }
          ],
          "correctAnswer": "A",
          "explanationNote": "FSM ensures that only logic valid for the current state (Menu, Playing, Paused, GameOver) executes, preventing edge-case bugs.",
          "id": "q-14-3-collision-rules-scoring-5-v1"
        },
        "retestMcq": {
          "question": "When in the VICTORY state, which operations should continue to run each frame?",
          "options": [
            { "id": "A", "text": "Event polling and victory UI/particle rendering, while disabling enemy hazard updates", "explanationIfWrong": "This is the correct answer." },
            { "id": "B", "text": "All enemy collision checks and health decrements", "explanationIfWrong": "Enemies should not damage the player after victory." },
            { "id": "C", "text": "Nothing at all; the program should sleep for 10 minutes", "explanationIfWrong": "Sleeping freezes the window." },
            { "id": "D", "text": "Immediate exit to the operating system desktop", "explanationIfWrong": "Abrupt exiting gives no closure to the player." }
          ],
          "correctAnswer": "A",
          "explanationNote": "Victory states keep animations, audio, and celebration particles active while freezing hazard interactions.",
          "id": "q-14-3-collision-rules-scoring-5-v2"
        },
        "questionPool": [
          {
            "question": "What is the primary advantage of modeling game flow as a Finite State Machine (FSM)?",
            "options": [
              { "id": "A", "text": "It cleanly isolates update/render logic and eliminates messy boolean flags like is_paused, is_dead, is_menu", "explanationIfWrong": "This is the correct answer." },
              { "id": "B", "text": "It automatically converts 2D sprites into 3D models", "explanationIfWrong": "FSM is software architecture, not 3D rendering." },
              { "id": "C", "text": "It forces the GPU to run at maximum clock speed", "explanationIfWrong": "FSM does not overclock hardware." },
              { "id": "D", "text": "It bypasses Python memory management", "explanationIfWrong": "Python memory management remains intact." }
            ],
            "correctAnswer": "A",
            "explanationNote": "FSM ensures that only logic valid for the current state (Menu, Playing, Paused, GameOver) executes, preventing edge-case bugs.",
            "id": "q-14-3-collision-rules-scoring-5-v1"
          },
          {
            "question": "When in the VICTORY state, which operations should continue to run each frame?",
            "options": [
              { "id": "A", "text": "Event polling and victory UI/particle rendering, while disabling enemy hazard updates", "explanationIfWrong": "This is the correct answer." },
              { "id": "B", "text": "All enemy collision checks and health decrements", "explanationIfWrong": "Enemies should not damage the player after victory." },
              { "id": "C", "text": "Nothing at all; the program should sleep for 10 minutes", "explanationIfWrong": "Sleeping freezes the window." },
              { "id": "D", "text": "Immediate exit to the operating system desktop", "explanationIfWrong": "Abrupt exiting gives no closure to the player." }
            ],
            "correctAnswer": "A",
            "explanationNote": "Victory states keep animations, audio, and celebration particles active while freezing hazard interactions.",
            "id": "q-14-3-collision-rules-scoring-5-v2"
          }
        ]
      }
    ]
  },
  {
    "id": "14-4-custom-game-project",
    "number": "14.4",
    "title": "Game Polish, Optimization & Capstone Synthesis",
    "subtitle": "Apply screen shake, particle systems, performance profiling, and synthesize all 14 parts into your capstone project.",
    "readTime": "24 min",
    "objectives": [
      "Incorporate visual 'game juice' including camera screen shake and impact flashes",
      "Build modular particle systems for sparks, explosions, and dust trails",
      "Profile rendering performance and eliminate frame rate bottleneck traps",
      "Package Python games into standalone executables using PyInstaller",
      "Synthesize all 14 parts of the curriculum into an architected capstone game engine",
      "Graduate from foundational Python programming to advanced engineering horizons"
    ],
    "theoryBlocks": [
      {
        "heading": "Game Juice: Screen Shake & Impact Feedback",
        "text": "The difference between a bland game and an addictive game is 'Game Juice'\u2014tactile visual and audio feedback for player actions. Screen shake is achieved by offsetting the entire rendering canvas by a small random offset `(dx, dy)` during intense impacts (explosions or taking damage). A screen-shake timer decays over a few frames, restoring the camera to `(0, 0)`.",
        "codeSnippet": "import random\n\nshake_duration = 0.2  # Shake for 0.2 seconds\ndt = 0.0166\nshake_offset_x, shake_offset_y = 0, 0\n\nif shake_duration > 0:\n    shake_duration -= dt\n    # Generate random vibration offset\n    shake_offset_x = random.randint(-6, 6)\n    shake_offset_y = random.randint(-6, 6)\nelse:\n    shake_offset_x, shake_offset_y = 0, 0\n\nprint(f\"Render frame offset: ({shake_offset_x}, {shake_offset_y})\")",
        "terminalOutput": "Render frame offset: (4, -3)",
        "tip": "Blit your game world to an intermediate canvas surface, then blit that canvas to the display window with `(shake_offset_x, shake_offset_y)`!",
        "mcq": {
          "question": "What is 'Game Juice' in video game design?",
          "options": [
            {
              "id": "A",
              "text": "Polished audio-visual feedback (screen shake, flashes, sound effects, particles) that makes interactions feel punchy and responsive",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "An energy drink sponsored by gaming tournaments",
              "explanationIfWrong": "Game juice is an established game design term for tactile feedback."
            },
            {
              "id": "C",
              "text": "Memory optimization algorithms",
              "explanationIfWrong": "Juice refers to aesthetics and feedback feel."
            },
            {
              "id": "D",
              "text": "Battery optimization for mobile gaming",
              "explanationIfWrong": "It relates to player engagement and game feel."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Game juice refers to dynamic embellishments that make games satisfying to play without altering core rules.",
          "id": "q-14-4-custom-game-project-0-v1"
        },
        "retestMcq": {
          "question": "How is camera screen shake implemented mathematically?",
          "options": [
            {
              "id": "A",
              "text": "By adding small pseudo-random (dx, dy) offsets to the rendering camera position and decaying the offset magnitude over time",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "By rotating the monitor physically",
              "explanationIfWrong": "Shake is simulated in software on the render surface."
            },
            {
              "id": "C",
              "text": "By deleting 10% of screen pixels",
              "explanationIfWrong": "Pixels are translated, not deleted."
            },
            {
              "id": "D",
              "text": "By changing the computer screen resolution back and forth",
              "explanationIfWrong": "Resolution switching causes hardware flickering; screen shake offsets the canvas."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Randomly displacing the render canvas by a few pixels for a fraction of a second creates the classic impact vibration.",
          "id": "q-14-4-custom-game-project-0-v2"
        },
        "questionPool": [
          {
            "question": "What is 'Game Juice' in video game design?",
            "options": [
              {
                "id": "A",
                "text": "Polished audio-visual feedback (screen shake, flashes, sound effects, particles) that makes interactions feel punchy and responsive",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "An energy drink sponsored by gaming tournaments",
                "explanationIfWrong": "Game juice is an established game design term for tactile feedback."
              },
              {
                "id": "C",
                "text": "Memory optimization algorithms",
                "explanationIfWrong": "Juice refers to aesthetics and feedback feel."
              },
              {
                "id": "D",
                "text": "Battery optimization for mobile gaming",
                "explanationIfWrong": "It relates to player engagement and game feel."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Game juice refers to dynamic embellishments that make games satisfying to play without altering core rules.",
            "id": "q-14-4-custom-game-project-0-v1"
          },
          {
            "question": "How is camera screen shake implemented mathematically?",
            "options": [
              {
                "id": "A",
                "text": "By adding small pseudo-random (dx, dy) offsets to the rendering camera position and decaying the offset magnitude over time",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "By rotating the monitor physically",
                "explanationIfWrong": "Shake is simulated in software on the render surface."
              },
              {
                "id": "C",
                "text": "By deleting 10% of screen pixels",
                "explanationIfWrong": "Pixels are translated, not deleted."
              },
              {
                "id": "D",
                "text": "By changing the computer screen resolution back and forth",
                "explanationIfWrong": "Resolution switching causes hardware flickering; screen shake offsets the canvas."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Randomly displacing the render canvas by a few pixels for a fraction of a second creates the classic impact vibration.",
            "id": "q-14-4-custom-game-project-0-v2"
          },
          {
            "question": "Why should screen shake duration and magnitude decay quickly (e.g. over 0.2 - 0.4 seconds)?",
            "options": [
              {
                "id": "A",
                "text": "Prolonged screen shaking disorients players and induces motion sickness",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "The computer monitor may break",
                "explanationIfWrong": "Software render offsets cannot damage hardware."
              },
              {
                "id": "C",
                "text": "Pygame crashes if shake exceeds 1 second",
                "explanationIfWrong": "No crash occurs; it is an ergonomic game feel decision."
              },
              {
                "id": "D",
                "text": "It resets high scores",
                "explanationIfWrong": "Score data is independent of camera shake."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Brief, punchy screen shake communicates impact without overwhelming player vision or causing nausea.",
            "id": "q-14-4-custom-game-project-0-v3"
          }
        ]
      },
      {
        "heading": "Modular Particle Systems",
        "text": "Particle systems generate dynamic visual effects like explosion sparks, smoke puffs, and coin sparkle bursts. A particle is a lightweight object with position `(x, y)`, velocity `(vx, vy)`, a color, and a lifespan (e.g. `0.5` seconds). On every frame, update the particle's position, shrink its radius or fade its alpha, and decrease its lifespan. When lifespan reaches `0`, remove the particle from the active list.",
        "codeSnippet": "import random\n\nclass Particle:\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n        self.vx = random.uniform(-100, 100)\n        self.vy = random.uniform(-150, -50)  # Erupt upwards\n        self.lifetime = 0.5                  # Half-second life\n        self.radius = 4.0\n\n    def update(self, dt):\n        self.x += self.vx * dt\n        self.y += self.vy * dt\n        self.lifetime -= dt\n        self.radius = max(0.0, self.radius - (4.0 * dt / 0.5))\n\n    def is_dead(self):\n        return self.lifetime <= 0 or self.radius <= 0\n\np = Particle(100, 100)\np.update(0.1)\nprint(f\"Particle alive? {not p.is_dead()} | Radius: {p.radius:.2f}\")",
        "terminalOutput": "Particle alive? True | Radius: 3.20",
        "tip": "Use list comprehensions to prune dead particles cleanly: `particles = [p for p in particles if not p.is_dead()]`.",
        "mcq": {
          "question": "What are the core properties that define a single particle in a particle system?",
          "options": [
            {
              "id": "A",
              "text": "Position (x, y), Velocity (vx, vy), Lifespan/Timer, and visual properties (color, radius/alpha)",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Database credentials and network port",
              "explanationIfWrong": "Particles are ephemeral visual objects in RAM."
            },
            {
              "id": "C",
              "text": "A full Pygame window instance",
              "explanationIfWrong": "Particles are drawn on existing surfaces."
            },
            {
              "id": "D",
              "text": "A saved game file path",
              "explanationIfWrong": "Particles are temporary and never saved to disk."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "A particle is a lightweight kinetic point that updates its position, shrinks or fades, and self-terminates.",
          "id": "q-14-4-custom-game-project-1-v1"
        },
        "retestMcq": {
          "question": "How do you clean up hundreds of expired particles each frame without memory leaks?",
          "options": [
            {
              "id": "A",
              "text": "particles = [p for p in particles if not p.is_dead()]",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "particles.clear() on every frame",
              "explanationIfWrong": "Clearing every frame destroys live particles instantly before they animate."
            },
            {
              "id": "C",
              "text": "del particles",
              "explanationIfWrong": "Deleting the list variable causes NameError on the next frame."
            },
            {
              "id": "D",
              "text": "pygame.particle.delete()",
              "explanationIfWrong": "Pygame has no built-in particle module."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "A list comprehension filtering out dead particles maintains active ones while reclaiming memory from expired ones.",
          "id": "q-14-4-custom-game-project-1-v2"
        },
        "questionPool": [
          {
            "question": "What are the core properties that define a single particle in a particle system?",
            "options": [
              {
                "id": "A",
                "text": "Position (x, y), Velocity (vx, vy), Lifespan/Timer, and visual properties (color, radius/alpha)",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Database credentials and network port",
                "explanationIfWrong": "Particles are ephemeral visual objects in RAM."
              },
              {
                "id": "C",
                "text": "A full Pygame window instance",
                "explanationIfWrong": "Particles are drawn on existing surfaces."
              },
              {
                "id": "D",
                "text": "A saved game file path",
                "explanationIfWrong": "Particles are temporary and never saved to disk."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "A particle is a lightweight kinetic point that updates its position, shrinks or fades, and self-terminates.",
            "id": "q-14-4-custom-game-project-1-v1"
          },
          {
            "question": "How do you clean up hundreds of expired particles each frame without memory leaks?",
            "options": [
              {
                "id": "A",
                "text": "particles = [p for p in particles if not p.is_dead()]",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "particles.clear() on every frame",
                "explanationIfWrong": "Clearing every frame destroys live particles instantly before they animate."
              },
              {
                "id": "C",
                "text": "del particles",
                "explanationIfWrong": "Deleting the list variable causes NameError on the next frame."
              },
              {
                "id": "D",
                "text": "pygame.particle.delete()",
                "explanationIfWrong": "Pygame has no built-in particle module."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "A list comprehension filtering out dead particles maintains active ones while reclaiming memory from expired ones.",
            "id": "q-14-4-custom-game-project-1-v2"
          },
          {
            "question": "How can you simulate gravity pulling smoke or debris particles downwards over time?",
            "options": [
              {
                "id": "A",
                "text": "particle.vy += GRAVITY * dt on every frame update",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "particle.x += 10",
                "explanationIfWrong": "Horizontal displacement is not gravity."
              },
              {
                "id": "C",
                "text": "particle.radius = 0",
                "explanationIfWrong": "Radius controls size, not trajectory."
              },
              {
                "id": "D",
                "text": "By rotating the screen surface",
                "explanationIfWrong": "Gravity is added to vertical velocity."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Adding gravity * dt to vertical velocity creates realistic parabolic ballistic arcs for explosion debris.",
            "id": "q-14-4-custom-game-project-1-v3"
          }
        ]
      },
      {
        "heading": "Performance Profiling & Bottleneck Optimization",
        "text": "If a game stutters or drops below 60 FPS, avoid blind guessing; profile your code! Common Pygame performance bottlenecks include: 1) Calling `pygame.image.load()` or `pygame.font.SysFont()` inside the game loop; 2) Forgetting `.convert()` or `.convert_alpha()` on surfaces; 3) Creating hundreds of unused Surface objects per frame; 4) Running un-indexed $O(N^2)$ collision loops across thousands of objects. Monitor real-time performance using `clock.get_fps()`.",
        "codeSnippet": "import pygame\n\npygame.init()\nclock = pygame.time.Clock()\nscreen = pygame.display.set_mode((400, 300))\n\n# Simulated frame loop\nfor _ in range(5):\n    clock.tick(60)\n    fps = clock.get_fps()\n    # print(f\"Live Performance: {fps:.1f} FPS\")\n\nprint(\"Golden rule: Never load assets or create fonts inside the while loop!\")\npygame.quit()",
        "terminalOutput": "Golden rule: Never load assets or create fonts inside the while loop!",
        "tip": "Pre-load all fonts, images, and sounds BEFORE the while loop begins. Inside the loop, only update math and draw!",
        "mcq": {
          "question": "Which of the following is the most frequent cause of massive frame rate drops in beginner Pygame projects?",
          "options": [
            {
              "id": "A",
              "text": "Calling pygame.font.SysFont() or pygame.image.load() inside the game loop on every frame",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Using integer coordinates instead of floats",
              "explanationIfWrong": "Integers are faster than floats."
            },
            {
              "id": "C",
              "text": "Using snake_case variable names",
              "explanationIfWrong": "Variable names have zero impact on bytecode runtime performance."
            },
            {
              "id": "D",
              "text": "Running clock.tick(60)",
              "explanationIfWrong": "clock.tick(60) regulates smooth timing."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Disk loading and OS font rasterization are thousands of times slower than rendering; doing so every frame cripples performance.",
          "id": "q-14-4-custom-game-project-2-v1"
        },
        "retestMcq": {
          "question": "How can you inspect your game's real-time Frames Per Second?",
          "options": [
            {
              "id": "A",
              "text": "clock.get_fps()",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "pygame.get_speed()",
              "explanationIfWrong": "The method is on the Clock instance: clock.get_fps()."
            },
            {
              "id": "C",
              "text": "screen.fps",
              "explanationIfWrong": "Surfaces do not measure FPS."
            },
            {
              "id": "D",
              "text": "sys.get_framerate()",
              "explanationIfWrong": "The clock object tracks frame rate."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "clock.get_fps() computes a smoothed average of frames rendered per second.",
          "id": "q-14-4-custom-game-project-2-v2"
        },
        "questionPool": [
          {
            "question": "Which of the following is the most frequent cause of massive frame rate drops in beginner Pygame projects?",
            "options": [
              {
                "id": "A",
                "text": "Calling pygame.font.SysFont() or pygame.image.load() inside the game loop on every frame",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Using integer coordinates instead of floats",
                "explanationIfWrong": "Integers are faster than floats."
              },
              {
                "id": "C",
                "text": "Using snake_case variable names",
                "explanationIfWrong": "Variable names have zero impact on bytecode runtime performance."
              },
              {
                "id": "D",
                "text": "Running clock.tick(60)",
                "explanationIfWrong": "clock.tick(60) regulates smooth timing."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Disk loading and OS font rasterization are thousands of times slower than rendering; doing so every frame cripples performance.",
            "id": "q-14-4-custom-game-project-2-v1"
          },
          {
            "question": "How can you inspect your game's real-time Frames Per Second?",
            "options": [
              {
                "id": "A",
                "text": "clock.get_fps()",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "pygame.get_speed()",
                "explanationIfWrong": "The method is on the Clock instance: clock.get_fps()."
              },
              {
                "id": "C",
                "text": "screen.fps",
                "explanationIfWrong": "Surfaces do not measure FPS."
              },
              {
                "id": "D",
                "text": "sys.get_framerate()",
                "explanationIfWrong": "The clock object tracks frame rate."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "clock.get_fps() computes a smoothed average of frames rendered per second.",
            "id": "q-14-4-custom-game-project-2-v2"
          },
          {
            "question": "Why is convert_alpha() so crucial for blitting speed on transparent PNG sprites?",
            "options": [
              {
                "id": "A",
                "text": "It pre-matches the pixel bit-depth and color channel masks to the display surface so the CPU/GPU can copy memory directly",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "It deletes the alpha channel to make the image opaque",
                "explanationIfWrong": "convert_alpha preserves transparency."
              },
              {
                "id": "C",
                "text": "It changes image resolution to 4K",
                "explanationIfWrong": "Pixel dimensions are untouched."
              },
              {
                "id": "D",
                "text": "It uploads the image to AWS",
                "explanationIfWrong": "Conversion happens locally in RAM."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Without convert_alpha(), Pygame must perform runtime pixel format translations on every blit, creating severe bottlenecks.",
            "id": "q-14-4-custom-game-project-2-v3"
          }
        ]
      },
      {
        "heading": "Packaging Games with PyInstaller",
        "text": "To share your game with friends or players who do not have Python or Pygame installed, you can bundle your project into a standalone executable (`.exe` on Windows, `.app` on macOS, binary on Linux) using `PyInstaller`. Running `pyinstaller --onefile --windowed --add-data 'assets;assets' main.py` packages the Python runtime, Pygame libraries, and game assets into a single double-clickable application.",
        "codeSnippet": "# Terminal command to create a standalone Windows .exe:\n# pyinstaller --onefile --noconsole --add-data \"assets;assets\" main.py\n\n# --onefile: Bundles everything into a single standalone .exe\n# --noconsole: Suppresses background black terminal window\n# --add-data: Includes images, sounds, and fonts inside package\n\nprint(\"PyInstaller bundles Python + dependencies + assets into a native executable.\")",
        "terminalOutput": "PyInstaller bundles Python + dependencies + assets into a native executable.",
        "tip": "The `--noconsole` flag (or `--windowed`) launches your game as a pure desktop application without opening a separate command prompt window.",
        "mcq": {
          "question": "What tool is widely used to convert Python games into standalone executable files (.exe) for distribution?",
          "options": [
            {
              "id": "A",
              "text": "PyInstaller",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "pip install",
              "explanationIfWrong": "pip installs packages; it does not bundle standalone executables."
            },
            {
              "id": "C",
              "text": "Git",
              "explanationIfWrong": "Git is version control."
            },
            {
              "id": "D",
              "text": "Docker exclusively",
              "explanationIfWrong": "Docker containers require a container runtime; PyInstaller makes native desktop executables."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "PyInstaller packages Python scripts and all C dependencies into self-contained standalone executables.",
          "id": "q-14-4-custom-game-project-3-v1"
        },
        "retestMcq": {
          "question": "What does the --noconsole (or --windowed) flag do in PyInstaller?",
          "options": [
            {
              "id": "A",
              "text": "Prevents the black command prompt terminal window from opening behind the game window",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Mutes all sound effects",
              "explanationIfWrong": "Audio is unaffected."
            },
            {
              "id": "C",
              "text": "Disables keyboard input",
              "explanationIfWrong": "Game input remains fully functional."
            },
            {
              "id": "D",
              "text": "Runs the game in fullscreen mode",
              "explanationIfWrong": "Window sizing is controlled by set_mode."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "--noconsole suppresses the console stdout window, giving commercial desktop polish.",
          "id": "q-14-4-custom-game-project-3-v2"
        },
        "questionPool": [
          {
            "question": "What tool is widely used to convert Python games into standalone executable files (.exe) for distribution?",
            "options": [
              {
                "id": "A",
                "text": "PyInstaller",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "pip install",
                "explanationIfWrong": "pip installs packages; it does not bundle standalone executables."
              },
              {
                "id": "C",
                "text": "Git",
                "explanationIfWrong": "Git is version control."
              },
              {
                "id": "D",
                "text": "Docker exclusively",
                "explanationIfWrong": "Docker containers require a container runtime; PyInstaller makes native desktop executables."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "PyInstaller packages Python scripts and all C dependencies into self-contained standalone executables.",
            "id": "q-14-4-custom-game-project-3-v1"
          },
          {
            "question": "What does the --noconsole (or --windowed) flag do in PyInstaller?",
            "options": [
              {
                "id": "A",
                "text": "Prevents the black command prompt terminal window from opening behind the game window",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Mutes all sound effects",
                "explanationIfWrong": "Audio is unaffected."
              },
              {
                "id": "C",
                "text": "Disables keyboard input",
                "explanationIfWrong": "Game input remains fully functional."
              },
              {
                "id": "D",
                "text": "Runs the game in fullscreen mode",
                "explanationIfWrong": "Window sizing is controlled by set_mode."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "--noconsole suppresses the console stdout window, giving commercial desktop polish.",
            "id": "q-14-4-custom-game-project-3-v2"
          },
          {
            "question": "Why is the --add-data flag needed when building an executable for a game with sprite images?",
            "options": [
              {
                "id": "A",
                "text": "To package external asset folders (images, sounds, fonts) inside the executable bundle",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "To download extra RAM from the internet",
                "explanationIfWrong": "RAM cannot be downloaded."
              },
              {
                "id": "C",
                "text": "To compile Python docstrings",
                "explanationIfWrong": "Docstrings are embedded in code."
              },
              {
                "id": "D",
                "text": "To register game copyright",
                "explanationIfWrong": "add-data bundles resource files."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "PyInstaller only bundles .py files by default; non-code assets (images, audio) must be included via --add-data.",
            "id": "q-14-4-custom-game-project-3-v3"
          }
        ]
      },
      {
        "heading": "The Complete Capstone Synthesis & Stage 2 Graduation",
        "text": "Congratulations on reaching Part 14! You have traveled from foundational variables, loops, and lists in Stage 1 all the way through Object-Oriented Class Hierarchies, List/Dict Comprehensions, Recursion, Functional Programming, Regular Expressions, and full real-time 2D game architecture. You now possess the end-to-end engineering skills to conceptualize, architect, debug, optimize, and ship production-grade Python applications.",
        "codeSnippet": "# Synthesis: Integrating the entire Python curriculum into an engine\n# Part 1-3: Variables, Conditionals, Loops, Functions\n# Part 4-5: Sequences, Nested Matrices, Slicing\n# Part 6-7: File I/O, Error Handling, Modular Design\n# Part 8-10: OOP, Encapsulation, Methods, Inheritance, Polymorphism\n# Part 11: Comprehensions, Recursion, Memoization\n# Part 12: First-Class Functions, Generators, Regex\n# Part 13-14: Pygame, Event Loops, Physics & Capstone Game Engine!\n\nprint(\"DO PILOT: Python Core Curriculum \u2014 100% COMPLETE!\")",
        "terminalOutput": "DO PILOT: Python Core Curriculum \u2014 100% COMPLETE!",
        "tip": "You are now fully prepared for advanced domain specializations: Full Stack Web Engineering, AI & Machine Learning, and Enterprise Systems Architecture!",
        "mcq": {
          "question": "How do the skills learned across all 14 parts synergize in a real-world Python application like an arcade game?",
          "options": [
            {
              "id": "A",
              "text": "OOP models entities, comprehensions filter data, recursion traverses trees, file I/O persists high scores, and Pygame orchestrates the real-time event loop",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Each part can only be used independently in separate Python files",
              "explanationIfWrong": "Software development synthesizes all techniques together into cohesive architectures."
            },
            {
              "id": "C",
              "text": "Pygame replaces all previous Python language features",
              "explanationIfWrong": "Pygame relies heavily on classes, loops, and data structures."
            },
            {
              "id": "D",
              "text": "Only Part 1 is required for production software",
              "explanationIfWrong": "Advanced applications require classes, data structures, and algorithms."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Production software is a holistic synthesis of data structures, algorithms, object-oriented design, and real-time event processing.",
          "id": "q-14-4-custom-game-project-4-v1"
        },
        "retestMcq": {
          "question": "What is the recommended next step after mastering core Python, algorithms, and 2D architecture?",
          "options": [
            {
              "id": "A",
              "text": "Specialize into advanced fields such as Full Stack Web Development (FastAPI, React), AI & Machine Learning, or Cloud Architecture",
              "explanationIfWrong": "This is the correct answer."
            },
            {
              "id": "B",
              "text": "Never write Python code again",
              "explanationIfWrong": "Python is the world's most popular language; continue expanding your skillset."
            },
            {
              "id": "C",
              "text": "Delete your IDE",
              "explanationIfWrong": "Continue building real-world projects."
            },
            {
              "id": "D",
              "text": "Only write code on paper",
              "explanationIfWrong": "Hands-on project development is the key to software mastery."
            }
          ],
          "correctAnswer": "A",
          "explanationNote": "Solid Python core foundations unlock high-value domains: modern web backends, artificial intelligence, and scalable cloud engineering.",
          "id": "q-14-4-custom-game-project-4-v2"
        },
        "questionPool": [
          {
            "question": "How do the skills learned across all 14 parts synergize in a real-world Python application like an arcade game?",
            "options": [
              {
                "id": "A",
                "text": "OOP models entities, comprehensions filter data, recursion traverses trees, file I/O persists high scores, and Pygame orchestrates the real-time event loop",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Each part can only be used independently in separate Python files",
                "explanationIfWrong": "Software development synthesizes all techniques together into cohesive architectures."
              },
              {
                "id": "C",
                "text": "Pygame replaces all previous Python language features",
                "explanationIfWrong": "Pygame relies heavily on classes, loops, and data structures."
              },
              {
                "id": "D",
                "text": "Only Part 1 is required for production software",
                "explanationIfWrong": "Advanced applications require classes, data structures, and algorithms."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Production software is a holistic synthesis of data structures, algorithms, object-oriented design, and real-time event processing.",
            "id": "q-14-4-custom-game-project-4-v1"
          },
          {
            "question": "What is the recommended next step after mastering core Python, algorithms, and 2D architecture?",
            "options": [
              {
                "id": "A",
                "text": "Specialize into advanced fields such as Full Stack Web Development (FastAPI, React), AI & Machine Learning, or Cloud Architecture",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "Never write Python code again",
                "explanationIfWrong": "Python is the world's most popular language; continue expanding your skillset."
              },
              {
                "id": "C",
                "text": "Delete your IDE",
                "explanationIfWrong": "Continue building real-world projects."
              },
              {
                "id": "D",
                "text": "Only write code on paper",
                "explanationIfWrong": "Hands-on project development is the key to software mastery."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "Solid Python core foundations unlock high-value domains: modern web backends, artificial intelligence, and scalable cloud engineering.",
            "id": "q-14-4-custom-game-project-4-v2"
          },
          {
            "question": "What core tenet from The Zen of Python should guide your software development journey forward?",
            "options": [
              {
                "id": "A",
                "text": "'Simple is better than complex. Readability counts. Beautiful is better than ugly.'",
                "explanationIfWrong": "This is the correct answer."
              },
              {
                "id": "B",
                "text": "'Write as much code as possible on a single line'",
                "explanationIfWrong": "Dense unreadable one-liners violate Python philosophy."
              },
              {
                "id": "C",
                "text": "'Never write unit tests'",
                "explanationIfWrong": "Testing is fundamental to reliable software."
              },
              {
                "id": "D",
                "text": "'Always use global variables'",
                "explanationIfWrong": "Global variables are discouraged."
              }
            ],
            "correctAnswer": "A",
            "explanationNote": "The Zen of Python emphasizes clarity, elegance, simplicity, and readability above all else.",
            "id": "q-14-4-custom-game-project-4-v3"
          }
        ]
      },
      {
        "heading": "Final Capstone Verification & Full Pygame Mastery",
        "text": "Completing the capstone project represents mastery over full-stack Python systems: from algorithms and object-oriented design patterns to real-time interactive game loops and event pumps. Rigorous pre-release verification involves testing edge-case collisions, confirming persistent save file integrity across sessions, validating that frame rates remain locked at 60 FPS, and certifying that audio channels clean up without memory leaks upon game completion.",
        "codeSnippet": "def verify_production_build():\n    assert pygame.display.get_init(), 'Display driver not active'\n    assert pygame.mixer.get_init(), 'Audio subsystem failed to initialize'\n    print('Production build verification passed! All systems nominal.')\n\nif __name__ == '__main__':\n    verify_production_build()\n    game = Game()\n    game.run()",
        "terminalOutput": "Production build verification passed! All systems nominal.\nRunning Capstone Game Engine at 60.0 FPS [Clean]",
        "tip": "Always write automated smoke tests to verify asset loading and save-file serialization before releasing your build.",
        "mcq": {
          "question": "What is the final milestone in delivering a production-ready Python game application?",
          "options": [
            { "id": "A", "text": "Validating asset loading, stable 60 FPS frame timing, clean persistence, and graceful process exit", "explanationIfWrong": "This is the correct answer." },
            { "id": "B", "text": "Converting all Python files into raw machine code by hand", "explanationIfWrong": "PyInstaller or standard Python bytecode compilers handle packaging." },
            { "id": "C", "text": "Disabling all error logging", "explanationIfWrong": "Logging is crucial for debugging production builds." },
            { "id": "D", "text": "Deleting the virtual environment before distributing", "explanationIfWrong": "Standalone packages bundle runtime dependencies." }
          ],
          "correctAnswer": "A",
          "explanationNote": "Production readiness means rock-solid performance, zero missing asset crashes, clean save serialization, and no zombie processes upon exit.",
          "id": "q-14-4-custom-game-project-5-v1"
        },
        "retestMcq": {
          "question": "Why is testing on clean target machines without Python pre-installed a vital quality assurance step?",
          "options": [
            { "id": "A", "text": "To verify that packaged executables include all bundled DLLs, fonts, and runtime dependencies", "explanationIfWrong": "This is the correct answer." },
            { "id": "B", "text": "To speed up Python execution", "explanationIfWrong": "Testing does not change execution speed." },
            { "id": "C", "text": "Because Python only runs once per machine", "explanationIfWrong": "Python can run indefinitely on any machine." },
            { "id": "D", "text": "To check if Pygame can format hard drives", "explanationIfWrong": "Pygame has no disk formatting functions." }
          ],
          "correctAnswer": "A",
          "explanationNote": "Testing on a clean system verifies that no local path dependencies (absolute paths or unbundled DLLs) break on user computers.",
          "id": "q-14-4-custom-game-project-5-v2"
        },
        "questionPool": [
          {
            "question": "What is the final milestone in delivering a production-ready Python game application?",
            "options": [
              { "id": "A", "text": "Validating asset loading, stable 60 FPS frame timing, clean persistence, and graceful process exit", "explanationIfWrong": "This is the correct answer." },
              { "id": "B", "text": "Converting all Python files into raw machine code by hand", "explanationIfWrong": "PyInstaller or standard Python bytecode compilers handle packaging." },
              { "id": "C", "text": "Disabling all error logging", "explanationIfWrong": "Logging is crucial for debugging production builds." },
              { "id": "D", "text": "Deleting the virtual environment before distributing", "explanationIfWrong": "Standalone packages bundle runtime dependencies." }
            ],
            "correctAnswer": "A",
            "explanationNote": "Production readiness means rock-solid performance, zero missing asset crashes, clean save serialization, and no zombie processes upon exit.",
            "id": "q-14-4-custom-game-project-5-v1"
          },
          {
            "question": "Why is testing on clean target machines without Python pre-installed a vital quality assurance step?",
            "options": [
              { "id": "A", "text": "To verify that packaged executables include all bundled DLLs, fonts, and runtime dependencies", "explanationIfWrong": "This is the correct answer." },
              { "id": "B", "text": "To speed up Python execution", "explanationIfWrong": "Testing does not change execution speed." },
              { "id": "C", "text": "Because Python only runs once per machine", "explanationIfWrong": "Python can run indefinitely on any machine." },
              { "id": "D", "text": "To check if Pygame can format hard drives", "explanationIfWrong": "Pygame has no disk formatting functions." }
            ],
            "correctAnswer": "A",
            "explanationNote": "Testing on a clean system verifies that no local path dependencies (absolute paths or unbundled DLLs) break on user computers.",
            "id": "q-14-4-custom-game-project-5-v2"
          }
        ]
      }
    ]
  }
];

// Question pool selector for Part 14
export const getActiveQuestionsForLevelPart14 = (
  section: SectionContent,
  studentId: string,
  forceNewQuestions: boolean = false
): McqQuestion[] => {
  const historyKey = `dopilot_part14_seen_history_${section.id}_${studentId}`;
  const activeSetKey = `dopilot_part14_active_qset_${section.id}_${studentId}`;

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

// Consecutive failure tracking helpers for Part 14
export const getConsecutiveFailuresPart14 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part14_consecutive_failures_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const getConsecutiveFailedLevelsPart14 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part14_failed_levels_streak_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const getLevelAttemptCountPart14 = (sectionId: string, studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_part14_attempt_${sectionId}_${studentId}`);
    return saved ? Number(saved) : 1;
  } catch {
    return 1;
  }
};

export const setLevelAttemptCountPart14 = (sectionId: string, studentId: string, count: number): void => {
  try {
    localStorage.setItem(`dopilot_part14_attempt_${sectionId}_${studentId}`, String(count));
  } catch {}
};

export const recordLevelAttemptResultPart14 = (
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
  const currentAttempt = getLevelAttemptCountPart14(sectionId, studentId);

  if (isPassed) {
    try {
      localStorage.setItem(`dopilot_part14_failed_levels_streak_${studentId}`, '0');
      localStorage.setItem(`dopilot_part14_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_part14_attempt_${sectionId}_${studentId}`, '1');
      localStorage.removeItem(`dopilot_part14_locked_${studentId}`);
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
      setLevelAttemptCountPart14(sectionId, studentId, 2);
      const streak = getConsecutiveFailedLevelsPart14(studentId);

      return {
        isPassed: false,
        attemptCount: 1,
        isSecondFailureInLevel: false,
        consecutiveFailedLevels: streak,
        isLocked: false
      };
    } else {
      const prevStreak = getConsecutiveFailedLevelsPart14(studentId);
      const newStreak = prevStreak + 1;
      const isLocked = newStreak >= 3;

      try {
        localStorage.setItem(`dopilot_part14_failed_levels_streak_${studentId}`, String(newStreak));
        localStorage.setItem(`dopilot_part14_consecutive_failures_${studentId}`, String(newStreak));
        if (isLocked) {
          localStorage.setItem(`dopilot_part14_locked_${studentId}`, 'true');
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

export const resetConsecutiveFailuresPart14 = (studentId: string): void => {
  try {
    localStorage.setItem(`dopilot_part14_consecutive_failures_${studentId}`, '0');
    localStorage.setItem(`dopilot_part14_failed_levels_streak_${studentId}`, '0');
    localStorage.removeItem(`dopilot_part14_locked_${studentId}`);
    localStorage.removeItem(`dopilot_part14_locked_progression_${studentId}`);
  } catch {}
};
