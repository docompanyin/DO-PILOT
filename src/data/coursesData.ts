export interface CourseModule {
  number: string;
  title: string;
  duration: string;
  topics: string[];
  section?: string;
}

export interface CourseDetail {
  id: string;
  slug: string;
  category: 'python' | 'java' | 'web' | 'ai' | 'security';
  badge: string;
  badgeColor: string;
  image: string;
  title: string;
  headline: string;
  description: string;
  duration: string;
  level: string;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  prerequisites: string;
  technologies: string[];
  outcomes: string[];
  modules: CourseModule[];
  capstoneProject: {
    title: string;
    description: string;
    skills: string[];
  };
  mentor: {
    name: string;
    role: string;
    experience: string;
    company: string;
    avatar: string;
  };
}

export const COURSES_DATA: CourseDetail[] = [
  {
    id: 'python-core',
    slug: 'complete-python-programming',
    category: 'python',
    badge: 'Bestseller',
    badgeColor: 'bg-primary/20 text-primary border-primary/30',
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=1200&auto=format&fit=crop&q=80',
    title: 'Complete Python Course',
    headline: 'Master Python from syntax fundamentals to object-oriented architecture and interactive 2D games.',
    description: 'A comprehensive, hands-on programming track from fundamentals to advanced architecture. Learn core syntax, algorithmic problem solving, object-oriented design, file processing, and interactive applications.',
    duration: '14 Comprehensive Modules',
    level: 'Beginner to Advanced',
    rating: 4.9,
    reviewsCount: 428,
    studentsCount: 1680,
    prerequisites: 'No prior experience required. Basic computer familiarity.',
    technologies: ['Python 3.12', 'Data Structures', 'OOP', 'File I/O', 'Algorithms', 'Pygame'],
    outcomes: [
      'Write clean Python code with variables, loops, and functions.',
      'Master core data structures: lists, dictionaries, tuples, and sets.',
      'Design scalable applications using Object-Oriented Programming (OOP).',
      'Handle files, error handling, and build interactive 2D games.'
    ],
    modules: [
      {
        number: '01',
        title: 'Getting Started & Variables',
        duration: 'Part 1',
        section: 'Stage 1: Core Fundamentals (Parts 1 – 7)',
        topics: [
          'Getting started with Python setup and execution',
          'Information from the user (input handling)',
          'Variables and fundamental data types',
          'Arithmetic operations and calculations',
          'Conditional statements (if, else)'
        ]
      },
      {
        number: '02',
        title: 'Conditionals & Simple Loops',
        duration: 'Part 2',
        topics: [
          'Core programming terminology and conventions',
          'More conditionals (nested checks and elif)',
          'Combining conditions with logical operators (and, or, not)',
          'Simple loops and basic iteration'
        ]
      },
      {
        number: '03',
        title: 'Loops with Conditions & Defining Functions',
        duration: 'Part 3',
        topics: [
          'Loops with conditions (while loops, break, continue)',
          'Working with strings, indexing, and slicing',
          'More loops and nested iteration patterns',
          'Defining custom functions and return values'
        ]
      },
      {
        number: '04',
        title: 'Developer Tools, Functions & Lists',
        duration: 'Part 4',
        topics: [
          'The Visual Studio Code editor, Python interpreter and built-in debugging tool',
          'More functions and parameter scopes',
          'Lists: creation, manipulation, and methods',
          'Definite iteration with for loops',
          'Print statement formatting and string formatting',
          'Working with strings and lists together'
        ]
      },
      {
        number: '05',
        title: 'Data Structures: Dictionaries & Tuples',
        duration: 'Part 5',
        topics: [
          'Advanced list manipulation and 2D matrices',
          'Object references and variable assignment mechanics',
          'Dictionaries: key-value storage, lookup, and updates',
          'Tuples and immutable data collections'
        ]
      },
      {
        number: '06',
        title: 'Reading, Writing Files & Error Handling',
        duration: 'Part 6',
        topics: [
          'Reading files and line-by-line parsing',
          'Writing files and saving application data',
          'Handling errors and exceptions (try, except)',
          'Understanding local and global variable scopes'
        ]
      },
      {
        number: '07',
        title: 'Modules, Randomness & Data Processing',
        duration: 'Part 7',
        topics: [
          'Working with Python standard modules',
          'Randomness and pseudo-random numbers',
          'Working with times and dates',
          'Data processing and filtering workflows',
          'Creating and importing your own custom modules',
          'More modern Python features'
        ]
      },
      {
        number: '08',
        title: 'Objects, Classes & Methods',
        duration: 'Part 8',
        section: 'Stage 2: Advanced Architecture & Projects (Parts 8 – 14)',
        topics: [
          'Objects and methods in Python',
          'Classes and object instances',
          'Defining classes and constructors (__init__)',
          'Defining methods and self reference',
          'Practical real-world examples of classes'
        ]
      },
      {
        number: '09',
        title: 'Object References & Encapsulation',
        duration: 'Part 9',
        topics: [
          'Objects and memory references',
          'Objects as attributes inside other objects',
          'Encapsulation and data protection',
          'Scope of methods and helper functions',
          'Class attributes vs. instance attributes',
          'More examples with class design'
        ]
      },
      {
        number: '10',
        title: 'Class Hierarchies & Architecture',
        duration: 'Part 10',
        topics: [
          'Class hierarchies and inheritance',
          'Access modifiers and encapsulation conventions',
          'Object-oriented programming techniques',
          'Developing a larger modular application'
        ]
      },
      {
        number: '11',
        title: 'Comprehensions & Recursion',
        duration: 'Part 11',
        topics: [
          'List comprehensions and concise syntax',
          'More comprehensions (sets, dictionaries)',
          'Understanding recursion and base conditions',
          'Practical recursion examples and call stack'
        ]
      },
      {
        number: '12',
        title: 'Functional Programming & Regular Expressions',
        duration: 'Part 12',
        topics: [
          'Functions as first-class arguments',
          'Generators and memory-efficient iterators (yield)',
          'Functional programming (map, filter, lambda)',
          'Regular expressions for search and validation'
        ]
      },
      {
        number: '13',
        title: 'Pygame, Animation & Events',
        duration: 'Part 13',
        topics: [
          'Introduction to Pygame window and game loop',
          'Rendering graphics, shapes, and animation',
          'Handling keyboard and mouse user events',
          'More Pygame techniques and movement mechanics'
        ]
      },
      {
        number: '14',
        title: 'Interactive 2D Game Project',
        duration: 'Part 14',
        topics: [
          'Game architecture and project setup',
          'Robot, obstacles, and boxes mechanics',
          'Finishing the game, collision rules, and scoring',
          'Designing and building your own custom game'
        ]
      }
    ],
    capstoneProject: {
      title: 'Interactive 2D Arcade Game & Modular Python Engine',
      description: 'Synthesize all 14 parts: architect an interactive 2D game using Pygame with object-oriented class hierarchies, sprite animations, keyboard event handling, obstacle collision mechanics, and local high-score file persistence.',
      skills: ['Pygame', 'OOP & Classes', 'Event Loops', 'Collision Detection', 'File Persistence']
    },
    mentor: {
      name: 'Dr. Anand Raman',
      role: 'Staff Python Architect',
      experience: '11+ Years in Software Engineering',
      company: 'Lead Systems Engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=faces'
    }
  },
  {
    id: 'java-core',
    slug: 'complete-java-programming',
    category: 'java',
    badge: 'Popular',
    badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
    title: 'Complete Java Course',
    headline: 'Master Java from core fundamentals and OOP to Collections, Streams, and software design.',
    description: 'A comprehensive programming track covering core fundamentals to scalable architecture. Master Java syntax, object-oriented design, collections, functional streams, and robust error handling.',
    duration: '14 Comprehensive Modules',
    level: 'Beginner to Advanced',
    rating: 4.95,
    reviewsCount: 388,
    studentsCount: 1940,
    prerequisites: 'No prior experience required. Basic computer familiarity.',
    technologies: ['Java 21', 'OOP & Classes', 'Collections', 'Streams & Lambdas', 'Exception Handling', 'Algorithms'],
    outcomes: [
      'Write structured Java programs with solid object-oriented design.',
      'Master encapsulation, inheritance, polymorphism, and interfaces.',
      'Work efficiently with Collections (Lists, Maps, Sets) and Streams.',
      'Build reliable, test-driven applications with robust exception handling.'
    ],
    modules: [
      {
        number: '01',
        title: 'Getting Started, Variables & Conditionals',
        duration: 'Part 1',
        section: 'Stage 1: Core Fundamentals (Parts 1 – 7)',
        topics: [
          'Getting started with programming and Java source code execution',
          'Printing with System.out.println() and System.out.print()',
          'Reading user input from the console with Scanner',
          'Variables and fundamental primitive types (int, double, boolean, String)',
          'Calculating with numbers and integer division mechanics',
          'Conditional statements (if, else if, else) and comparison operators'
        ]
      },
      {
        number: '02',
        title: 'Repeating Functionality & Methods',
        duration: 'Part 2',
        topics: [
          'Recurring problems and loops (while, for, break, continue)',
          'Counting and calculating with iterative loops',
          'Methods: declaring methods, parameters, and return values',
          'Call stack and execution flow of methods'
        ]
      },
      {
        number: '03',
        title: 'Lists, Arrays & Using Strings',
        duration: 'Part 3',
        topics: [
          'Lists: creating and appending elements to ArrayList',
          'Iterating through lists and index-based lookups',
          'Arrays: fixed-length memory structures',
          'String methods, splitting text, and parsing tokens'
        ]
      },
      {
        number: '04',
        title: 'Introduction to Object-Oriented Programming',
        duration: 'Part 4',
        topics: [
          'Classes and object instances',
          'Defining class attributes, constructors, and instance methods',
          'Encapsulation and private vs public access modifiers',
          'Objects in a list and object references'
        ]
      },
      {
        number: '05',
        title: 'Learning Object-Oriented Programming',
        duration: 'Part 5',
        topics: [
          'Primitive vs reference variables in Java memory',
          'Method overloading and this keyword',
          'Objects as method parameters and return values',
          'Comparing objects with equals() and toString() method'
        ]
      },
      {
        number: '06',
        title: 'Separating UI from Program Logic',
        duration: 'Part 6',
        topics: [
          'User interfaces and text-based UI architecture',
          'Separation of concerns: UI layer vs domain logic',
          'Unit testing with JUnit assertions',
          'Software debugging and refactoring best practices'
        ]
      },
      {
        number: '07',
        title: 'Programming Paradigms & Algorithm Analysis',
        duration: 'Part 7',
        topics: [
          'Programming paradigms and architectural patterns',
          'Linear search vs Binary search algorithms',
          'Sorting algorithms (Selection sort, Quick sort)',
          'Large programming project architecture and testing'
        ]
      },
      {
        number: '08',
        title: 'Recap, HashMaps & Grouping Data',
        duration: 'Part 8',
        section: 'Stage 2: Advanced Architecture & Projects (Parts 8 – 14)',
        topics: [
          'Short recap of Stage 1 fundamentals',
          'HashMaps: key-value storage and hash functions',
          'Similarity of objects (hashCode and equals)',
          'Grouping data with multi-value maps'
        ]
      },
      {
        number: '09',
        title: 'Class Inheritance & Interfaces',
        duration: 'Part 9',
        topics: [
          'Class inheritance with extends keyword and super',
          'Abstract classes and partial implementation',
          'Interfaces as contracts: implements keyword',
          'Polymorphism and interface-based design'
        ]
      },
      {
        number: '10',
        title: 'Collections, Streams & Lambda Expressions',
        duration: 'Part 10',
        topics: [
          'Handling collections with Streams API',
          'Lambda expressions and functional programming in Java',
          'Stream pipelines: filter, map, reduce, collect',
          'Comparable and Comparator interfaces for sorting'
        ]
      },
      {
        number: '11',
        title: 'Class Diagrams, Packages & Exceptions',
        duration: 'Part 11',
        topics: [
          'UML Class diagrams and architectural modeling',
          'Java packages and directory structures',
          'Exception handling: try-catch-finally and throws',
          'Reading and writing files with Java I/O'
        ]
      },
      {
        number: '12',
        title: 'Type Parameters & Generics',
        duration: 'Part 12',
        topics: [
          'Type parameters and Generic classes',
          'Generic methods and bounded type parameters',
          'Multi-dimensional arrays and matrix manipulation',
          'Randomness and probabilistic simulation'
        ]
      },
      {
        number: '13',
        title: 'JavaFX & Graphical User Interfaces',
        duration: 'Part 13',
        topics: [
          'JavaFX architecture: Stage, Scene, and Node graph',
          'UI Components: Buttons, TextFields, Labels, Layouts',
          'Event-driven programming and action handlers',
          'Multiple views and dynamic scene switching'
        ]
      },
      {
        number: '14',
        title: 'Data Visualization & Advanced Projects',
        duration: 'Part 14',
        topics: [
          'Data visualization: Line charts, Bar charts, and Plots',
          'Multimedia in JavaFX: audio and graphical animations',
          'Synthesizing all parts into an enterprise Java capstone application',
          'Final project presentation and code quality review'
        ]
      }
    ],
    capstoneProject: {
      title: 'Enterprise Management System & Interactive Java Application',
      description: 'Synthesize all 14 parts: architect an enterprise-grade Java application featuring object-oriented domain models, Collections & HashMaps, Stream data processing, robust file persistence, and automated unit testing.',
      skills: ['Java 21', 'OOP & Inheritance', 'Java Collections', 'Streams API', 'JUnit Testing', 'File I/O']
    },
    mentor: {
      name: 'Rajesh Venkat',
      role: 'Principal Java Architect',
      experience: '12+ Years in Distributed Systems',
      company: 'Lead Enterprise Engineer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=faces'
    }
  },
  {
    id: 'fullstack-open',
    slug: 'fullstack-open',
    category: 'web',
    badge: 'Career Track',
    badgeColor: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    title: 'Full Stack Open Course',
    headline: 'Master modern full-stack web development with React, Node.js, Express, TypeScript, and Docker.',
    description: 'A comprehensive full-stack web development track. Build responsive Single Page Applications with React, create backend APIs with Node.js and Express, manage databases, and deploy with Docker and CI/CD.',
    duration: '14 Comprehensive Modules',
    level: 'Intermediate to Advanced',
    rating: 4.98,
    reviewsCount: 512,
    studentsCount: 2420,
    prerequisites: 'Basic programming fundamentals. HTML & CSS covered from scratch.',
    technologies: ['React 18', 'Node.js', 'Express', 'TypeScript', 'MongoDB', 'PostgreSQL', 'GraphQL', 'Docker'],
    outcomes: [
      'Build responsive Single Page Applications with React and TypeScript.',
      'Architect RESTful APIs and GraphQL services using Node.js and Express.',
      'Store and query data with MongoDB and relational PostgreSQL.',
      'Containerize apps with Docker and automate deployment with CI/CD.'
    ],
    modules: [
      {
        number: '00',
        title: 'Fundamentals of Web Apps',
        duration: 'Part 0',
        section: 'Stage 1: Frontend & Fullstack Fundamentals (Parts 0 – 5)',
        topics: ['HTTP Protocol (GET/POST)', 'HTML & CSS Layouts', 'Document Object Model (DOM)', 'Traditional Web Apps vs SPAs', 'AJAX & Dynamic JSON Fetching', 'Sequence Diagrams & Event Loop']
      },
      {
        number: '01',
        title: 'Introduction to React',
        duration: 'Part 1',
        section: 'Stage 1: Frontend & Fullstack Fundamentals (Parts 0 – 5)',
        topics: ['React Component Architecture', 'JSX Syntax & Compilation', 'Props & Passing Component Data', 'State Management with useState', 'Event Handling & Re-rendering', 'Component Debugging & Best Practices']
      },
      {
        number: '02',
        title: 'Communicating with Server',
        duration: 'Part 2',
        section: 'Stage 1: Frontend & Fullstack Fundamentals (Parts 0 – 5)',
        topics: ['Rendering Collections with .map()', 'Keys & Reconciliation', 'Controlled Forms & User Input', 'Fetching Data with Axios', 'REST API CRUD Operations', 'Component CSS & UI Notifications']
      },
      {
        number: '03',
        title: 'Programming a Server with NodeJS and Express',
        duration: 'Part 3',
        section: 'Stage 1: Frontend & Fullstack Fundamentals (Parts 0 – 5)',
        topics: ['Node.js Event-Driven Architecture', 'Express Server Setup & Routing', 'RESTful API Standards', 'Middleware & Error Handlers', 'MongoDB & Mongoose Schemas', 'Backend Validation & ESLint']
      },
      {
        number: '04',
        title: 'Testing Express Servers, User Administration',
        duration: 'Part 4',
        section: 'Stage 1: Frontend & Fullstack Fundamentals (Parts 0 – 5)',
        topics: ['Backend Architecture & Project Structure', 'Automated Testing with Supertest & Jest', 'User Administration & Password Hashing (Bcrypt)', 'Token Authentication (JWT)', 'Authorization Middleware', 'Testing Protected Routes']
      },
      {
        number: '05',
        title: 'Testing React Apps & E2E Testing',
        duration: 'Part 5',
        section: 'Stage 1: Frontend & Fullstack Fundamentals (Parts 0 – 5)',
        topics: ['Frontend Login Flow & LocalStorage', 'Props.children & Conditional Rendering', 'Component Testing with React Testing Library', 'Simulating User Interactions', 'End-to-End Testing with Playwright', 'Test Environment Configurations']
      },
      {
        number: '06',
        title: 'Advanced State Management: Redux & Query',
        duration: 'Part 6',
        section: 'Stage 2: Advanced Architecture & Production Systems (Parts 6 – 13)',
        topics: ['Flux Architecture & Redux Store', 'Pure Reducers & Action Creators', 'Redux Toolkit (createSlice & configureStore)', 'Asynchronous Thunks for Server Sync', 'Server State with React Query (TanStack Query)', 'useReducer & Context API Comparison']
      },
      {
        number: '07',
        title: 'React Router, Custom Hooks & Modern Styling',
        duration: 'Part 7',
        section: 'Stage 2: Advanced Architecture & Production Systems (Parts 6 – 13)',
        topics: ['Multi-Page Routing with React Router 6', 'Parameterized Routes & useParams', 'Authoring Custom React Hooks', 'Modern UI Frameworks (Tailwind & Material UI)', 'Webpack Bundler Architecture', 'Production Build Optimization']
      },
      {
        number: '08',
        title: 'GraphQL & Modern API Design',
        duration: 'Part 8',
        section: 'Stage 2: Advanced Architecture & Production Systems (Parts 6 – 13)',
        topics: ['GraphQL Schema Definition Language (SDL)', 'Queries & Mutations with Resolvers', 'Apollo Server Setup & Context', 'Apollo Client in React Applications', 'Cache Management & Normalized Updates', 'Real-Time Subscriptions with WebSockets']
      },
      {
        number: '09',
        title: 'TypeScript for Full-Stack Applications',
        duration: 'Part 9',
        section: 'Stage 2: Advanced Architecture & Production Systems (Parts 6 – 13)',
        topics: ['TypeScript Compiler & Type Inference', 'Interfaces, Types & Generics', 'Typing Express Request & Response', 'Typing React Components, Props & Hooks', 'Discriminated Unions & Type Guards', 'Utility Types & Strict Mode']
      },
      {
        number: '10',
        title: 'React Native Mobile Development',
        duration: 'Part 10',
        section: 'Stage 2: Advanced Architecture & Production Systems (Parts 6 – 13)',
        topics: ['React Native Architecture & Expo', 'Core Mobile Components (View, Text, FlatList)', 'Touch Events & Formik Forms', 'Mobile App Styling with StyleSheet', 'Communicating with Remote Servers', 'Mobile Navigation & Deep Linking']
      },
      {
        number: '11',
        title: 'CI/CD Pipelines & Automation',
        duration: 'Part 11',
        section: 'Stage 2: Advanced Architecture & Production Systems (Parts 6 – 13)',
        topics: ['Continuous Integration & Deployment Concepts', 'GitHub Actions Workflows & Triggers', 'Automated Testing & Linting Pipelines', 'Automated Cloud Deployment', 'Health Checks & Safe Rollbacks', 'Semantic Versioning & Release Tagging']
      },
      {
        number: '12',
        title: 'Containers & Docker',
        duration: 'Part 12',
        section: 'Stage 2: Advanced Architecture & Production Systems (Parts 6 – 13)',
        topics: ['Containerization vs Virtualization', 'Dockerfiles, Base Images & Multi-Stage Builds', 'Volume Mounts & Data Persistence', 'Docker Compose Multi-Container Orchestration', 'Development vs Production Container Configs', 'Networking & Service Discovery']
      },
      {
        number: '13',
        title: 'Relational Databases & PostgreSQL',
        duration: 'Part 13',
        section: 'Stage 2: Advanced Architecture & Production Systems (Parts 6 – 13)',
        topics: ['Relational Database Architecture vs NoSQL', 'PostgreSQL Setup & SQL Queries', 'Object-Relational Mapping (ORM) with Sequelize', 'Database Migrations & Version Control', 'Many-to-Many Relationships & Join Tables', 'Query Optimization, Indexing & Transactions']
      }
    ],
    capstoneProject: {
      title: 'Production-Grade Full-Stack Enterprise Platform',
      description: 'Design and ship a complete full-stack web ecosystem: React 18 frontend with TypeScript and Redux Toolkit, Node/Express & PostgreSQL/MongoDB backend, GraphQL endpoints, automated Playwright test suites, containerized with Docker Compose, and deployed via GitHub Actions CI/CD.',
      skills: ['React & TS', 'Node.js & Express', 'PostgreSQL & MongoDB', 'GraphQL', 'Docker', 'CI/CD Pipelines']
    },
    mentor: {
      name: 'Matti Luukkainen',
      role: 'Full Stack Open Lead & Principal Engineer',
      experience: '15+ Years in Web Architecture & Education',
      company: 'University of Helsinki & Industry Fellow',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=faces'
    }
  },
  {
    id: 'ai-data-science',
    slug: 'python-ai-data-science',
    category: 'ai',
    badge: 'Trending',
    badgeColor: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
    title: 'Python for AI & Data Science',
    headline: 'Harness data analysis, machine learning pipelines, and modern Generative AI integrations.',
    description: 'Step into the future of computing. Learn to wrangle big data, build predictive machine learning models, visualize complex datasets, and build intelligent AI agents powered by OpenAI and LLM frameworks.',
    duration: '10 Weeks',
    level: 'Intermediate',
    rating: 4.92,
    reviewsCount: 290,
    studentsCount: 980,
    prerequisites: 'Basic Python programming logic or completion of Complete Python Course.',
    technologies: ['NumPy', 'Pandas', 'Matplotlib', 'Scikit-Learn', 'OpenAI API', 'LangChain', 'ChromaDB', 'Streamlit'],
    outcomes: [
      'Perform data wrangling, cleaning, and statistical exploratory analysis on messy datasets.',
      'Train, evaluate, and tune supervised and unsupervised Machine Learning models with Scikit-Learn.',
      'Implement Vector Embeddings and Semantic Search with ChromaDB.',
      'Build AI agents and Retrieval-Augmented Generation (RAG) applications with LangChain.',
      'Deploy interactive AI dashboards and demo apps using Streamlit.'
    ],
    modules: [
      {
        number: '01',
        title: 'Scientific Computing with NumPy & Pandas',
        duration: 'Weeks 1-3',
        topics: [
          'High-performance multidimensional arrays and vectorization with NumPy',
          'Data cleaning, transformation, missing values, and time-series with Pandas',
          'Interactive storytelling with Matplotlib and Seaborn visualization libraries'
        ]
      },
      {
        number: '02',
        title: 'Machine Learning Fundamentals & Model Tuning',
        duration: 'Weeks 4-6',
        topics: [
          'Supervised learning: Linear Regression, Logistic Regression, Decision Trees, and Random Forests',
          'Feature engineering, one-hot encoding, and scaling pipelines with Scikit-Learn',
          'Model evaluation: Cross-validation, Confusion Matrix, Precision/Recall, and ROC-AUC curves',
          'Unsupervised clustering: K-Means and Principal Component Analysis (PCA)'
        ]
      },
      {
        number: '03',
        title: 'Generative AI, LLMs & Retrieval Augmented Generation (RAG)',
        duration: 'Weeks 7-9',
        topics: [
          'Large Language Model fundamentals, tokenization, and prompt engineering strategies',
          'Vector embeddings, similarity search, and Vector DBs (ChromaDB / Pinecone)',
          'Building conversational document search (RAG) with LangChain and OpenAI APIs',
          'Function calling, structured JSON output, and autonomous AI agents'
        ]
      },
      {
        number: '04',
        title: 'Model Deployment & Interactive AI Products',
        duration: 'Week 10',
        topics: [
          'Packaging AI models into production microservices with FastAPI',
          'Building intuitive user interfaces with Streamlit and Gradio',
          'Deploying AI applications to cloud platforms with monitoring'
        ]
      }
    ],
    capstoneProject: {
      title: 'Intelligent Enterprise Document Q&A AI Assistant',
      description: 'Build a production-ready RAG application that ingests complex PDF documentation, generates dense vector embeddings, and enables natural language question-answering with exact source citations.',
      skills: ['Python', 'OpenAI', 'LangChain', 'ChromaDB', 'Streamlit', 'FastAPI']
    },
    mentor: {
      name: 'Priya Sharma',
      role: 'Lead AI Engineer',
      experience: '8+ Years in Applied Machine Learning & NLP',
      company: 'AI Research Lab / Tech Speaker',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&h=160&fit=crop&crop=faces'
    }
  },
  {
    id: 'cyber-security',
    slug: 'cyber-security-core',
    category: 'security',
    badge: 'High Demand',
    badgeColor: 'bg-cyan-400/20 text-cyan-300 border-cyan-400/30',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
    title: 'Cyber Security Course',
    headline: 'Master defensive system architecture, ethical hacking, malware analysis, and CISSP governance based on STL Academy & BSDM.',
    description: 'A comprehensive university-grade cybersecurity curriculum covering threat intelligence, enterprise architecture (SABSA/TOGAF), network scanning (Nmap/Wireshark), web app security (OWASP Top 10, SQLi), CISSP domains, and real-world forensic incident response.',
    duration: '14 Comprehensive Modules',
    level: 'Beginner to Advanced',
    rating: 4.95,
    reviewsCount: 380,
    studentsCount: 1420,
    prerequisites: 'Basic computer and networking literacy. Curiosity for defensive security engineering.',
    technologies: ['Nmap', 'Wireshark', 'Metasploit', 'Burp Suite', 'Snort IDS', 'Linux Shell', 'Cryptography & PKI', 'CISSP Architecture'],
    outcomes: [
      'Master the CIA Triad, AAA authentication, and ISO/IEC 27035 incident management.',
      'Deploy firewalls, IDS/IPS rules, VPN tunnels, and network access controls.',
      'Execute ethical penetration testing: footprinting, scanning, enumeration, and exploitation.',
      'Detect and mitigate web vulnerabilities including SQL Injection, XSS, and CSRF.',
      'Architect enterprise defense-in-depth frameworks aligning with CISSP governance standards.'
    ],
    modules: [
      {
        number: '01',
        title: 'Cyber Security Fundamentals & Incident Management',
        duration: 'Part 1',
        section: 'Stage 1: Defensive Fundamentals (Parts 1 – 2)',
        topics: ['Cybersecurity Threat Landscape & Attackers', 'CIA Triad & Authentication Models', 'Enterprise Security Architecture (SABSA & TOGAF)', 'Information System Governance & Risk Assessment', 'ISO/IEC 27035 Incident Handling Lifecycle']
      },
      {
        number: '02',
        title: 'Network Defense, Firewalls & Cryptography Foundations',
        duration: 'Part 2',
        section: 'Stage 1: Defensive Fundamentals (Parts 1 – 2)',
        topics: ['Routers, Switches, VLANs & IPSec Tunnels', 'Firewall Inspection Engines & LAN Security', 'Data Classification, BIA & Disaster Recovery', 'Access Control Models (DAC, MAC, RBAC, ABAC)', 'Kerberos & Identity Federation (SAML/OAuth)', 'Public Key Infrastructure (PKI) & AES Encryption']
      },
      {
        number: '03',
        title: 'Ethical Hacking, Footprinting & Network Scanning',
        duration: 'Part 3',
        section: 'Stage 2: Offensive Assessment & Penetration Testing (Parts 3 – 7)',
        topics: ['Ethical Hacking Methodologies & Legal NDAs', 'Passive & Active Footprinting (OSINT, WHOIS, Shodan)', 'Network Port Scanning with Nmap (SYN, TCP, Xmas)', 'Protocol Enumeration (NetBIOS, SNMP, LDAP)', 'Vulnerability Assessment with OpenVAS & CVSS']
      },
      {
        number: '04',
        title: 'System Hacking, Malware Analysis & Sniffing',
        duration: 'Part 4',
        section: 'Stage 2: Offensive Assessment & Penetration Testing (Parts 3 – 7)',
        topics: ['Password Cracking with Hashcat & John the Ripper', 'Linux SUID & Windows Privilege Escalation', 'Malware Taxonomy (Trojans, Ransomware, Rootkits)', 'Packet Sniffing with Wireshark & ARP Spoofing MitM']
      },
      {
        number: '05',
        title: 'Network Attacks, Denial of Service & Defense Evasion',
        duration: 'Part 5',
        section: 'Stage 2: Offensive Assessment & Penetration Testing (Parts 3 – 7)',
        topics: ['Social Engineering Tactics & Human Defense', 'SYN Flood, UDP Amplification & DDoS Mitigation', 'Session Hijacking & TCP Sequence Exploitation', 'Evading Firewalls, IDS Signatures & Honeypots']
      },
      {
        number: '06',
        title: 'Web Server Hacking, Web Applications & SQL Injection',
        duration: 'Part 6',
        section: 'Stage 2: Offensive Assessment & Penetration Testing (Parts 3 – 7)',
        topics: ['Web Server Hardening & Directory Traversal', 'OWASP Top 10 Vulnerabilities Breakdown', 'In-Band, Blind & UNION SQL Injection Exploitation', 'Parameterized Queries & Prepared Statement Defenses', 'Cross-Site Scripting (XSS) & CSRF Tokens']
      },
      {
        number: '07',
        title: 'Wireless, Mobile, IoT & Cloud Security',
        duration: 'Part 7',
        section: 'Stage 2: Offensive Assessment & Penetration Testing (Parts 3 – 7)',
        topics: ['802.11 WPA2 4-Way Handshake & WPA3 SAE', 'Rogue Access Points & Evil Twin Attacks', 'Mobile Security: Android Sandbox & iOS Jailbreak', 'IoT Protocols (MQTT, CoAP) & SCADA/ICS Hardening', 'Cloud Security Shared Responsibility Model']
      },
      {
        number: '08',
        title: 'CISSP: Security Governance & Risk Management',
        duration: 'Part 8',
        section: 'Stage 3: Enterprise Architecture & CISSP Mastery (Parts 8 – 12)',
        topics: ['(ISC)² Code of Ethics & Security Governance', 'Regulatory Compliance: GDPR, HIPAA, PCI-DSS', 'Data Classification & Asset Lifecycle Management', 'Business Continuity Planning (BCP), MTD, RTO & RPO']
      },
      {
        number: '09',
        title: 'CISSP: Security Engineering & System Architecture',
        duration: 'Part 9',
        section: 'Stage 3: Enterprise Architecture & CISSP Mastery (Parts 8 – 12)',
        topics: ['Bell-LaPadula Confidentiality Lattice Model', 'Biba Integrity & Clark-Wilson Models', 'Cryptographic System Design & Key Lifecycle', 'Physical Security: Mantrap Gates, HVAC & Fire Suppression']
      },
      {
        number: '10',
        title: 'CISSP: Communication, Network Security & IAM',
        duration: 'Part 10',
        section: 'Stage 3: Enterprise Architecture & CISSP Mastery (Parts 8 – 12)',
        topics: ['OSI 7-Layer Defense Architecture', 'Software-Defined Perimeters & Microsegmentation', 'Enterprise IAM, Active Directory & LDAP', 'Federated Single Sign-On & Contextual Adaptive MFA', 'Zero Trust Architecture: Never Trust, Always Verify']
      },
      {
        number: '11',
        title: 'CISSP: Security Assessment, Testing & SecOps',
        duration: 'Part 11',
        section: 'Stage 3: Enterprise Architecture & CISSP Mastery (Parts 8 – 12)',
        topics: ['Black/White/Grey Box Penetration Testing', 'Security Operations Center (SOC) Workflows', 'SIEM Event Correlation & SOAR Playbooks', 'Digital Forensics Chain of Custody & Memory Capture']
      },
      {
        number: '12',
        title: 'CISSP: Software Development Security (DevSecOps)',
        duration: 'Part 12',
        section: 'Stage 3: Enterprise Architecture & CISSP Mastery (Parts 8 – 12)',
        topics: ['Secure Software Development Lifecycle (S-SDLC)', 'Threat Modeling with STRIDE & Attack Trees', 'Static (SAST) vs Dynamic (DAST) Application Scanning', 'Software Bill of Materials (SBOM) & Supply Chain Security']
      },
      {
        number: '13',
        title: 'Advanced Systems Security, EDR & Next-Gen Cryptography',
        duration: 'Part 13',
        section: 'Stage 4: Advanced Defense & Real-World Operations (Parts 13 – 14)',
        topics: ['Endpoint Detection & Response (EDR) Telemetry', 'MITRE ATT&CK Framework Mapping', 'Post-Quantum Cryptography & Lattice Algorithms', 'Hardware Security Modules (HSM) & TPM 2.0 Secure Boot']
      },
      {
        number: '14',
        title: 'Cyber Policy, Governance & Real-World Incident Case Studies',
        duration: 'Part 14',
        section: 'Stage 4: Advanced Defense & Real-World Operations (Parts 13 – 14)',
        topics: ['Enterprise Security Policy Hierarchy & BYOD Rules', 'Stuxnet, SolarWinds & Equifax Incident Dissections', 'Executive Boardroom Threat Briefing', 'Comprehensive Enterprise Defense Capstone Audit']
      }
    ],
    capstoneProject: {
      title: 'Enterprise Threat Simulation & Defensive Hardening Audit',
      description: 'Perform a comprehensive security audit of a simulated enterprise infrastructure: conduct passive/active reconnaissance, vulnerability assessment, penetration testing with exploit verification, deploy Snort IDS rules and firewall microsegmentation, and author an executive board-level compliance and remediation report.',
      skills: ['Penetration Testing', 'Nmap & Wireshark', 'Burp Suite', 'Snort IDS', 'Linux Hardening', 'CISSP Governance']
    },
    mentor: {
      name: 'Vikram Malhotra',
      role: 'Principal Security Architect & CISSP Lead',
      experience: '14+ Years in Cyber Defense & Enterprise Security',
      company: 'Enterprise Security Practice / Ex-CERT Fellow',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=faces'
    }
  }
];

export const getCourseById = (idOrSlug: string): CourseDetail | undefined => {
  const norm = (idOrSlug || '').toLowerCase().replace(/_/g, '-');
  return COURSES_DATA.find(
    c => c.id === idOrSlug || c.slug === idOrSlug || c.title.toLowerCase() === idOrSlug.toLowerCase() ||
         c.id === norm || c.slug === norm ||
         (norm === 'full-stack-open' && c.id === 'fullstack-open') ||
         (norm === 'fullstack-open' && c.id === 'fullstack-open') ||
         (norm === 'full-stack-web' && c.id === 'fullstack-open') ||
         (norm === 'cyber-security' && c.id === 'cyber-security') ||
         (norm === 'cyber-security-core' && c.id === 'cyber-security') ||
         (norm === 'cybersecurity' && c.id === 'cyber-security')
  );
};
