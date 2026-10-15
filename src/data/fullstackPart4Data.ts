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

export const FULLSTACK_PART_4_SECTIONS: SectionContent[] = [
  {
    id: "4-1-project-structure-env",
    number: "4.1",
    title: "Project Structure & Environment Configuration",
    subtitle: "Separate Express app logic from HTTP server startup, configure dotenv environments, and organize code into controllers and utilities.",
    readTime: "12 min",
    objectives: [
      "Decouple Express app configuration from HTTP server port listening",
      "Organize backend applications into controllers, models, utils, and middleware",
      "Manage sensitive environment variables using dotenv and a config helper module",
      "Structure index.js to only import app and listen on the configured port",
      "Implement custom logger utilities that suppress logs during automated testing",
      "Set NODE_ENV to distinguish between development, test, and production"
    ],
    theoryBlocks: [
      {
        heading: "Separating App from HTTP Server",
        text: "Separating Express application configuration from index.js allows Supertest to test route handlers without binding to a physical network port.",
        codeSnippet: `// app.js: exports express app\nconst app = express();\nmodule.exports = app;\n\n// index.js: starts network listener\nconst app = require('./app');\napp.listen(PORT, () => console.log('Listening'));`,
        mcq: {
          id: "q-4.1-0-v1",
          question: "Why should the Express app definition in app.js be separated from app.listen() in index.js?",
          options: [
            { id: "A", text: "To enable Supertest to test HTTP endpoints without binding to an actual network port", explanationIfWrong: "This is the primary reason why Express apps are separated from listeners." },
            { id: "B", text: "Because Node.js does not allow app.listen() inside a file that defines middleware", explanationIfWrong: "Node.js allows app.listen() anywhere; separation is purely architectural for testability." },
            { id: "C", text: "To force Express to compile JavaScript files to WebAssembly before running", explanationIfWrong: "Express is a standard Node.js module and does not compile code to WebAssembly." },
            { id: "D", text: "Because MongoDB requires database connections to be declared before app.listen()", explanationIfWrong: "Mongoose can connect before or after; decoupling is strictly for automated integration testing." }
          ],
          correctAnswer: "A",
          explanationNote: "Exporting app from app.js without calling listen() allows testing libraries like Supertest to test HTTP requests internally without binding to an active TCP port."
        },
        retestMcq: {
          id: "q-4.1-0-v2",
          question: "What issue arises if an integration test imports index.js when app.listen() is declared inside it?",
          options: [
            { id: "A", text: "Jest attempts to start an active network port on every test file, leading to port collision errors (EADDRINUSE)", explanationIfWrong: "This correctly describes the port conflict problem." },
            { id: "B", text: "Express immediately crashes with a TypeError: listen is not a function", explanationIfWrong: "app.listen is a valid method and will actually run, which causes port conflicts." },
            { id: "C", text: "Mongoose automatically deletes all production collections when listen() runs", explanationIfWrong: "listen() starts an HTTP server; it has nothing to do with deleting collections." },
            { id: "D", text: "Supertest disables all HTTP request capabilities if listen() has been called", explanationIfWrong: "Supertest can still run, but port conflicts and lingering open server handles cause test failures." }
          ],
          correctAnswer: "A",
          explanationNote: "Calling app.listen() inside index.js starts an active network socket, resulting in EADDRINUSE collisions when multiple test suites run concurrently."
        }
      },
      {
        heading: "Environment Variables & config.js Module",
        text: "Centralizing environment variables into a utils/config.js module ensures consistent fallback defaults and isolates dotenv loading.",
        codeSnippet: `// utils/config.js\nrequire('dotenv').config();\nconst PORT = process.env.PORT || 3001;\nconst MONGODB_URI = process.env.NODE_ENV === 'test'\n  ? process.env.TEST_MONGODB_URI\n  : process.env.MONGODB_URI;\nmodule.exports = { MONGODB_URI, PORT };`,
        mcq: {
          id: "q-4.1-1-v1",
          question: "What is the recommended approach for handling database URIs between development and automated testing?",
          options: [
            { id: "A", text: "Point NODE_ENV === 'test' to a separate test database URI so test runs do not alter development data", explanationIfWrong: "Isolated test databases are critical to prevent wiping or corrupting development data." },
            { id: "B", text: "Use the same production database but prefix all collection names with 'test_'", explanationIfWrong: "Using the same production database risks accidental corruption; separate URIs are standard practice." },
            { id: "C", text: "Hardcode test passwords directly in the test files without environment variables", explanationIfWrong: "Hardcoding credentials is a major security vulnerability." },
            { id: "D", text: "Delete MongoDB Atlas completely and only use in-memory JSON files during testing", explanationIfWrong: "Using a dedicated test MongoDB database ensures tests validate real database queries." }
          ],
          correctAnswer: "A",
          explanationNote: "Checking process.env.NODE_ENV === 'test' switches to a dedicated test database URI, isolating test mutations from development and production datasets."
        },
        retestMcq: {
          id: "q-4.1-1-v2",
          question: "Where should sensitive secrets like database connection URIs and session keys be stored in a production-ready repository?",
          options: [
            { id: "A", text: "In a local .env file that is added to .gitignore and never committed to version control", explanationIfWrong: "Keeping .env out of version control is the essential security standard." },
            { id: "B", text: "In package.json under the 'scripts' property so all team members can access it", explanationIfWrong: "package.json is committed to Git, which exposes secrets publicly." },
            { id: "C", text: "Inside the public Git repository inside a secrets.txt file", explanationIfWrong: "Secrets committed to Git repositories lead to immediate credential leaks." },
            { id: "D", text: "Directly in index.js as constant string literals", explanationIfWrong: "Hardcoding credentials in source code exposes them to anyone reading the repository." }
          ],
          correctAnswer: "A",
          explanationNote: "Environment variables must be kept in .env and excluded from git commits via .gitignore to prevent accidental credential leakage."
        }
      },
      {
        heading: "Modular Routers with express.Router()",
        text: "express.Router() creates isolated mini-applications for route handling, decoupling controller logic from app middleware setup.",
        codeSnippet: `// controllers/notes.js\nconst notesRouter = require('express').Router();\nnotesRouter.get('/', async (req, res) => {\n  const notes = await Note.find({});\n  res.json(notes);\n});\nmodule.exports = notesRouter;`,
        mcq: {
          id: "q-4.1-2-v1",
          question: "How do you mount a router defined in controllers/notes.js onto the Express app in app.js?",
          options: [
            { id: "A", text: "app.use('/api/notes', notesRouter);", explanationIfWrong: "app.use mounts middleware and routers at the specified base path." },
            { id: "B", text: "app.mount('/api/notes', notesRouter);", explanationIfWrong: "Express does not have an app.mount() method; app.use() is used." },
            { id: "C", text: "notesRouter.listen('/api/notes');", explanationIfWrong: "Routers do not listen; they are middleware objects mounted onto the app." },
            { id: "D", text: "app.get('/api/notes', notesRouter());", explanationIfWrong: "Routers are mounted using app.use with the router instance, not app.get with invocation." }
          ],
          correctAnswer: "A",
          explanationNote: "app.use('/api/notes', notesRouter) mounts the router as middleware, prefixing all subroutes declared inside notesRouter with '/api/notes'."
        },
        retestMcq: {
          id: "q-4.1-2-v2",
          question: "If notesRouter is mounted at app.use('/api/notes', notesRouter), what route handler inside notesRouter responds to GET /api/notes/:id?",
          options: [
            { id: "A", text: "notesRouter.get('/:id', ...)", explanationIfWrong: "The router prefix is already '/api/notes', so the subpath is just '/:id'." },
            { id: "B", text: "notesRouter.get('/api/notes/:id', ...)", explanationIfWrong: "Including '/api/notes' here would make the full URL '/api/notes/api/notes/:id'." },
            { id: "C", text: "notesRouter.find('/:id', ...)", explanationIfWrong: "Routers use HTTP verb methods like .get(), .post(), etc., not .find()." },
            { id: "D", text: "notesRouter.all('notes/:id', ...)", explanationIfWrong: "Specific GET requests should be handled with .get('/:id')." }
          ],
          correctAnswer: "A",
          explanationNote: "Because the base URL '/api/notes' is defined when mounting in app.js, routes inside the router module are specified relative to that root (e.g. '/:id')."
        }
      },
      {
        heading: "Custom Logging Utility",
        text: "Wrapping console.log in a logger module enables conditional suppression of terminal logs during automated test suite execution.",
        codeSnippet: `// utils/logger.js\nconst info = (...params) => {\n  if (process.env.NODE_ENV !== 'test') {\n    console.log(...params);\n  }\n};\nmodule.exports = { info };`,
        mcq: {
          id: "q-4.1-3-v1",
          question: "Why is it beneficial to suppress console output in utils/logger.js when NODE_ENV is 'test'?",
          options: [
            { id: "A", text: "To prevent noisy console logs from cluttering clean Jest test runner reports", explanationIfWrong: "Suppressing non-error logs keeps test result output clean and readable." },
            { id: "B", text: "Because Node.js throws an unhandled exception if console.log is called in tests", explanationIfWrong: "Node.js allows console.log anywhere; it simply pollutes terminal output." },
            { id: "C", text: "Because Jest automatically fails any test that calls console.log", explanationIfWrong: "Jest does not fail tests on console.log; it prints them alongside results." },
            { id: "D", text: "To prevent memory leaks caused by string buffers in console streams", explanationIfWrong: "Console logging overhead is minimal; the goal is clean test reporting." }
          ],
          correctAnswer: "A",
          explanationNote: "Checking process.env.NODE_ENV !== 'test' keeps the test report clean, ensuring only test status and genuine failure assertions are printed."
        },
        retestMcq: {
          id: "q-4.1-3-v2",
          question: "Which logger function should generally NOT be suppressed, even in a test environment?",
          options: [
            { id: "A", text: "logger.error(...params) using console.error for critical unexpected failures", explanationIfWrong: "Genuine application errors must remain visible so developers can diagnose test failures." },
            { id: "B", text: "logger.info(...params) displaying every incoming HTTP request header", explanationIfWrong: "Informational request logs are precisely what should be muted during test runs." },
            { id: "C", text: "logger.debug(...params) logging raw database query buffers", explanationIfWrong: "Debug logs produce high noise and should be suppressed in automated tests." },
            { id: "D", text: "All logging must be completely disabled with process.exit()", explanationIfWrong: "Calling process.exit() terminates the Node.js process immediately." }
          ],
          correctAnswer: "A",
          explanationNote: "logger.error should always log genuine runtime exceptions to console.error so developers can troubleshoot unexpected test errors."
        }
      },
      {
        heading: "Folder Structure Architecture",
        text: "Separating controllers, models, utils, and middleware into distinct directories adheres to the Single Responsibility Principle.",
        codeSnippet: `├── app.js\n├── index.js\n├── controllers/\n│   └── notes.js\n├── models/\n│   └── note.js\n├── utils/\n│   ├── config.js\n│   ├── logger.js\n│   └── middleware.js`,
        mcq: {
          id: "q-4.1-4-v1",
          question: "In standard Full Stack Open project architecture, what is the sole responsibility of index.js?",
          options: [
            { id: "A", text: "Importing app and config, and calling app.listen() on the configured port", explanationIfWrong: "index.js serves as the entry point dedicated strictly to starting the server." },
            { id: "B", text: "Defining all Mongoose schemas and handling database validation", explanationIfWrong: "Schemas belong in the models/ directory." },
            { id: "C", text: "Declaring all Express middleware functions and error handlers", explanationIfWrong: "Middleware belongs in app.js and utils/middleware.js." },
            { id: "D", text: "Writing automated Supertest integration tests", explanationIfWrong: "Tests belong in tests/ directory." }
          ],
          correctAnswer: "A",
          explanationNote: "index.js only imports the Express app and launches the HTTP listener on the port specified by utils/config.js."
        },
        retestMcq: {
          id: "q-4.1-4-v2",
          question: "Where should custom middleware functions such as unknownEndpoint and errorHandler be organized?",
          options: [
            { id: "A", text: "In a dedicated utils/middleware.js module and exported for app.js to use", explanationIfWrong: "Centralizing middleware in utils/middleware.js keeps app.js clean and modular." },
            { id: "B", text: "Directly inside each Mongoose schema definition file", explanationIfWrong: "Models should only handle data definitions, not Express HTTP middleware." },
            { id: "C", text: "Inside package.json under the dependencies array", explanationIfWrong: "package.json lists npm package names, not JavaScript functions." },
            { id: "D", text: "Inside the client frontend src/ directory", explanationIfWrong: "Server middleware belongs strictly in the backend repository." }
          ],
          correctAnswer: "A",
          explanationNote: "Placing middleware in utils/middleware.js makes them reusable, unit-testable, and keeps app.js clean and declarative."
        }
      },
      {
        heading: "cross-env for Cross-Platform Scripts",
        text: "Windows and Unix command lines define environment variables differently; cross-env guarantees consistent environment variable assignment across OSes.",
        codeSnippet: `// package.json scripts:\n"scripts": {\n  "start": "cross-env NODE_ENV=production node index.js",\n  "dev": "cross-env NODE_ENV=development nodemon index.js",\n  "test": "cross-env NODE_ENV=test jest --verbose --runInBand"\n}`,
        mcq: {
          id: "q-4.1-5-v1",
          question: "Why is the cross-env package commonly used in npm scripts?",
          options: [
            { id: "A", text: "It allows setting environment variables like NODE_ENV seamlessly across Windows, macOS, and Linux", explanationIfWrong: "cross-env abstracts differences in environment variable syntax between Windows cmd/PowerShell and Unix bash." },
            { id: "B", text: "It translates JavaScript to Python at runtime", explanationIfWrong: "cross-env does not translate programming languages." },
            { id: "C", text: "It bypasses CORS policies in frontend web browsers", explanationIfWrong: "cross-env is a command-line utility for npm scripts, unrelated to browser CORS." },
            { id: "D", text: "It replaces the need for installing Node.js on the server", explanationIfWrong: "Node.js is always required to execute JavaScript." }
          ],
          correctAnswer: "A",
          explanationNote: "cross-env ensures that scripts setting environment variables (e.g. NODE_ENV=test) execute consistently across Windows, Linux, and macOS without syntax errors."
        },
        retestMcq: {
          id: "q-4.1-5-v2",
          question: "What happens on Windows if an npm script runs 'NODE_ENV=test jest' without cross-env?",
          options: [
            { id: "A", text: "Windows cmd.exe throws an error because 'NODE_ENV' is not recognized as an internal or external command", explanationIfWrong: "On Windows, setting an inline variable like Unix causes cmd to interpret NODE_ENV as a command." },
            { id: "B", text: "Jest automatically downloads cross-env and executes normally", explanationIfWrong: "Jest will not download packages automatically; the script will fail." },
            { id: "C", text: "Windows silently sets NODE_ENV to production instead of test", explanationIfWrong: "Windows does not fall back; it fails with a command not found error." },
            { id: "D", text: "The test suite passes but ignores all test assertions", explanationIfWrong: "The script terminates immediately with a command syntax error." }
          ],
          correctAnswer: "A",
          explanationNote: "Windows shell syntax differs from POSIX shells; running inline 'NODE_ENV=test' without cross-env causes Windows to fail with a command not found error."
        }
      }
    ]
  },
  {
    id: "4-2-testing-jest-supertest",
    number: "4.2",
    title: "Testing Node Applications: Jest & Supertest",
    subtitle: "Configure Jest for backend testing, write unit tests for helper functions, and test API endpoints using supertest.",
    readTime: "14 min",
    objectives: [
      "Configure Jest test environment to 'node' in package.json",
      "Write unit tests with describe, test, and expect assertions",
      "Perform HTTP integration testing with supertest against Express app",
      "Verify HTTP status codes, headers, and JSON response bodies",
      "Initialize and reset test database state before tests with beforeEach",
      "Close database connections after all tests complete using afterAll"
    ],
    theoryBlocks: [
      {
        heading: "Jest Environment Configuration",
        text: "Jest requires testEnvironment set to 'node' in package.json or jest.config.js to execute server-side Node tests rather than browser jsdom.",
        codeSnippet: `// package.json:\n"jest": {\n  "testEnvironment": "node"\n}`,
        mcq: {
          id: "q-4.2-0-v1",
          question: "Why must 'testEnvironment': 'node' be specified in Jest's configuration for backend testing?",
          options: [
            { id: "A", text: "Jest defaults to 'jsdom' (browser simulation), whereas backend code requires access to Node.js globals and modules", explanationIfWrong: "Setting 'node' instructs Jest to run in Node.js runtime instead of emulating a browser DOM." },
            { id: "B", text: "Because Express throws an error if Jest runs in less than 64-bit mode", explanationIfWrong: "Express has no concept of Jest's test environment configuration." },
            { id: "C", text: "To compile TypeScript directly into bytecode before running tests", explanationIfWrong: "testEnvironment selects the global runtime environment, not the compiler." },
            { id: "D", text: "To prevent Jest from executing test assertions in parallel", explanationIfWrong: "Parallelism is controlled by flags like --runInBand, not testEnvironment." }
          ],
          correctAnswer: "A",
          explanationNote: "By default Jest simulates a browser environment (jsdom); specifying 'node' provides genuine Node.js globals and standard server runtime features."
        },
        retestMcq: {
          id: "q-4.2-0-v2",
          question: "Which npm command is recommended for running Jest tests serially to prevent database race conditions?",
          options: [
            { id: "A", text: "jest --runInBand (or -i)", explanationIfWrong: "--runInBand forces Jest to run test suites sequentially in the main process." },
            { id: "B", text: "jest --parallel-all", explanationIfWrong: "Parallel execution can cause conflicting database mutations across test files." },
            { id: "C", text: "jest --no-cache-fast", explanationIfWrong: "This flag does not serialize test file execution." },
            { id: "D", text: "jest --watch-only", explanationIfWrong: "Watch mode does not serialize tests across multiple files." }
          ],
          correctAnswer: "A",
          explanationNote: "The --runInBand flag tells Jest to execute tests serially in a single process, avoiding conflicts where concurrent tests mutate the same test database."
        }
      },
      {
        heading: "Unit Testing Utility Functions",
        text: "Jest tests use test() or it() to define test cases and expect() matchers like toEqual() and toBe() to verify expected output.",
        codeSnippet: `// tests/list_helper.test.js\nconst { totalLikes } = require('../utils/list_helper');\ntest('of empty list is zero', () => {\n  expect(totalLikes([])).toBe(0);\n});`,
        mcq: {
          id: "q-4.2-1-v1",
          question: "In Jest, what is the difference between toBe() and toEqual() matchers?",
          options: [
            { id: "A", text: "toBe() tests exact referential identity (===), while toEqual() tests deep object/array equality", explanationIfWrong: "toBe uses Object.is / ===; toEqual deeply compares all properties of objects and arrays." },
            { id: "B", text: "toBe() only works on numbers, while toEqual() only works on strings", explanationIfWrong: "Both work on various data types, but check different levels of equality." },
            { id: "C", text: "toEqual() is asynchronous and returns a Promise, while toBe() is synchronous", explanationIfWrong: "Both matchers evaluate synchronously." },
            { id: "D", text: "There is no difference; they are aliases of each other", explanationIfWrong: "They differ fundamentally: toBe checks reference, toEqual checks values." }
          ],
          correctAnswer: "A",
          explanationNote: "toBe() uses strict referential identity (Object.is / ===). toEqual() performs deep equality comparison across all properties and array elements."
        },
        retestMcq: {
          id: "q-4.2-1-v2",
          question: "Which Jest block is used to logically group related tests together under a common header?",
          options: [
            { id: "A", text: "describe('total likes', () => { ... })", explanationIfWrong: "describe blocks group tests and provide structured test hierarchy." },
            { id: "B", text: "group('total likes', () => { ... })", explanationIfWrong: "Jest uses describe(), not group()." },
            { id: "C", text: "module('total likes', () => { ... })", explanationIfWrong: "module is a CommonJS keyword, not a Jest test group block." },
            { id: "D", text: "suite.section('total likes', () => { ... })", explanationIfWrong: "Jest provides top-level describe() for structuring suites." }
          ],
          correctAnswer: "A",
          explanationNote: "describe() creates a logical grouping for related tests, organizing output in the test runner and sharing setup hooks if needed."
        }
      },
      {
        heading: "Integration Testing with Supertest",
        text: "Supertest wraps the Express app, allowing simulated HTTP GET, POST, PUT, and DELETE requests without manually launching an external server.",
        codeSnippet: `const supertest = require('supertest');\nconst app = require('../app');\nconst api = supertest(app);\n\ntest('notes are returned as json', async () => {\n  await api\n    .get('/api/notes')\n    .expect(200)\n    .expect('Content-Type', /application\\/json/);\n});`,
        mcq: {
          id: "q-4.2-2-v1",
          question: "What does supertest(app) return when passed your Express application instance?",
          options: [
            { id: "A", text: "A test agent object equipped with methods like .get(), .post(), and .expect() to test routes", explanationIfWrong: "Supertest creates a high-level test client that makes requests directly to the app." },
            { id: "B", text: "A string containing the raw HTML output of the homepage", explanationIfWrong: "Supertest returns a test agent, not static HTML." },
            { id: "C", text: "A mock MongoDB connection pool", explanationIfWrong: "Supertest is strictly an HTTP testing library, not a database tool." },
            { id: "D", text: "An Express router instance", explanationIfWrong: "Supertest wraps the app to execute simulated HTTP calls." }
          ],
          correctAnswer: "A",
          explanationNote: "supertest(app) returns a request agent object that allows sending simulated HTTP requests (.get, .post, etc.) directly into Express route handlers."
        },
        retestMcq: {
          id: "q-4.2-2-v2",
          question: "How can you test both HTTP status code 200 and JSON Content-Type header in a single Supertest chain?",
          options: [
            { id: "A", text: "await api.get('/api/notes').expect(200).expect('Content-Type', /application\\/json/);", explanationIfWrong: "Chaining .expect() verifies both status and headers sequentially." },
            { id: "B", text: "await api.get('/api/notes').status(200).header('json');", explanationIfWrong: "Supertest uses .expect(status) and .expect(header, regex)." },
            { id: "C", text: "api.get('/api/notes').verify({ status: 200, type: 'json' });", explanationIfWrong: ".verify is not a Supertest method." },
            { id: "D", text: "await api.fetch('/api/notes', { expect: 200 });", explanationIfWrong: "Supertest uses .get(), .post(), etc., not .fetch()." }
          ],
          correctAnswer: "A",
          explanationNote: "Supertest allows fluent chaining of .expect() methods to assert status codes, headers, and response bodies in one continuous statement."
        }
      },
      {
        heading: "Initializing Database State with beforeEach",
        text: "A reliable test suite resets the test database to a known baseline before each test runs using the beforeEach hook.",
        codeSnippet: `beforeEach(async () => {\n  await Note.deleteMany({});\n  const noteObjects = initialNotes.map(n => new Note(n));\n  const promiseArray = noteObjects.map(n => n.save());\n  await Promise.all(promiseArray);\n});`,
        mcq: {
          id: "q-4.2-3-v1",
          question: "Why should beforeEach be used to reset and seed the database before every test?",
          options: [
            { id: "A", text: "To guarantee tests are completely independent and immune to side-effects from earlier tests", explanationIfWrong: "Test isolation guarantees that each test runs against a clean, predictable state." },
            { id: "B", text: "Because MongoDB Atlas automatically deletes collections every 10 seconds", explanationIfWrong: "Databases persist data indefinitely unless explicitly cleared." },
            { id: "C", text: "Because Supertest crashes if the database contains existing records", explanationIfWrong: "Supertest does not inspect database contents directly; tests manage their own state." },
            { id: "D", text: "To increase test execution duration so timers can synchronize", explanationIfWrong: "The goal is reproducibility and isolation, not adding artificial delay." }
          ],
          correctAnswer: "A",
          explanationNote: "Resetting the database in beforeEach ensures each test runs in total isolation from a known baseline, preventing tests from affecting one another."
        },
        retestMcq: {
          id: "q-4.2-3-v2",
          question: "What potential issue occurs if multiple asynchronous Mongoose saves inside a forEach loop are not awaited before the test runs?",
          options: [
            { id: "A", text: "forEach does not await async promises, so the test may execute before database seeding finishes", explanationIfWrong: "Standard Array.prototype.forEach does not wait for promises returned by its callback." },
            { id: "B", text: "Mongoose rejects all saves that are called inside loops", explanationIfWrong: "Mongoose allows saves in loops, but promises must be awaited properly." },
            { id: "C", text: "The Node runtime automatically replaces forEach with a synchronous while loop", explanationIfWrong: "JavaScript does not alter language constructs at runtime." },
            { id: "D", text: "Jest throws a syntax error immediately upon parsing forEach", explanationIfWrong: "forEach is standard JavaScript; the issue is that it does not await promises." }
          ],
          correctAnswer: "A",
          explanationNote: "Array.prototype.forEach cannot await async operations; using Promise.all(array.map(...)) or a for...of loop ensures all saves complete before tests begin."
        }
      },
      {
        heading: "Testing POST Requests & Data Verification",
        text: "Testing endpoint mutations involves sending a payload with .send(), verifying response properties, and checking that the database count increased.",
        codeSnippet: `test('a valid note can be added', async () => {\n  const newNote = { content: 'async/await is clean', important: true };\n  await api.post('/api/notes').send(newNote).expect(201);\n  const response = await api.get('/api/notes');\n  expect(response.body).toHaveLength(initialNotes.length + 1);\n});`,
        mcq: {
          id: "q-4.2-4-v1",
          question: "When testing a POST request that creates a new resource, which two verifications should always be made?",
          options: [
            { id: "A", text: "Verify the HTTP response code (e.g. 201 Created) and verify that the database count increased by 1", explanationIfWrong: "Checking both response code and database persistence verifies end-to-end correctness." },
            { id: "B", text: "Check that the CPU usage is below 10% and memory usage is zero", explanationIfWrong: "Performance profiling is not part of functional endpoint integration testing." },
            { id: "C", text: "Ensure the client browser's local storage has been cleared", explanationIfWrong: "Backend integration tests have no browser or local storage." },
            { id: "D", text: "Verify that the Express server restarts immediately", explanationIfWrong: "Servers should never restart during request processing." }
          ],
          correctAnswer: "A",
          explanationNote: "Robust POST testing verifies both the HTTP protocol response (status 201, returned body) and the actual database state (stored item count and contents)."
        },
        retestMcq: {
          id: "q-4.2-4-v2",
          question: "How should a test verify that an invalid POST request missing a required field is properly rejected?",
          options: [
            { id: "A", text: "Send the invalid payload, expect HTTP 400 Bad Request, and assert that the database count did not change", explanationIfWrong: "Testing negative cases ensures bad data is rejected without persisting to the database." },
            { id: "B", text: "Expect HTTP 200 and assume Express automatically filled in the missing field", explanationIfWrong: "Invalid data should be rejected with 400, not accepted with 200." },
            { id: "C", text: "Verify that Jest crashes with an uncaught exception", explanationIfWrong: "Tests should assert expected HTTP error responses, not unhandled crashes." },
            { id: "D", text: "Catch the error in a try/catch and ignore all assertions", explanationIfWrong: "Ignoring assertions leads to false-positive passing tests." }
          ],
          correctAnswer: "A",
          explanationNote: "Testing validation failures requires sending invalid data, asserting status code 400 Bad Request, and confirming no record was added to the database."
        }
      },
      {
        heading: "Closing Connections with afterAll",
        text: "Leaving database connection pools open after tests finish causes Jest to hang; afterAll closes Mongoose gracefully.",
        codeSnippet: `const mongoose = require('mongoose');\n\nafterAll(async () => {\n  await mongoose.connection.close();\n});`,
        mcq: {
          id: "q-4.2-5-v1",
          question: "What warning or symptom occurs if mongoose.connection.close() is omitted from afterAll in a Jest test file?",
          options: [
            { id: "A", text: "Jest outputs: 'Jest did not exit one second after the test run has completed' because the open database connection keeps the event loop active", explanationIfWrong: "Open network sockets prevent the Node.js event loop from exiting." },
            { id: "B", text: "Mongoose automatically deletes the test database", explanationIfWrong: "Mongoose does not delete databases when processes exit." },
            { id: "C", text: "Express permanently disables all routing middleware", explanationIfWrong: "Express is unrelated to closing Mongoose connection pools." },
            { id: "D", text: "The computer's operating system forces a kernel panic", explanationIfWrong: "Open sockets simply keep the Node.js process alive; they do not cause kernel panics." }
          ],
          correctAnswer: "A",
          explanationNote: "Open database sockets keep the Node.js event loop alive. Calling mongoose.connection.close() inside afterAll allows Jest to exit cleanly."
        },
        retestMcq: {
          id: "q-4.2-5-v2",
          question: "Which Jest hook executes exactly once after all tests in a test file have finished executing?",
          options: [
            { id: "A", text: "afterAll(() => { ... })", explanationIfWrong: "afterAll executes once at the conclusion of all tests in the file or describe block." },
            { id: "B", text: "afterEach(() => { ... })", explanationIfWrong: "afterEach runs after every individual test, not once at the end." },
            { id: "C", text: "finallyAll(() => { ... })", explanationIfWrong: "finallyAll is not a valid Jest hook name." },
            { id: "D", text: "onComplete(() => { ... })", explanationIfWrong: "Jest uses afterAll for post-suite cleanup." }
          ],
          correctAnswer: "A",
          explanationNote: "afterAll runs once after all test cases in the file complete, making it the ideal location for global teardown operations like closing database connections."
        }
      }
    ]
  },
  {
    id: "4-3-async-await-refactoring",
    number: "4.3",
    title: "Async/Await Refactoring & Error Handling",
    subtitle: "Eliminate callback chains and promise nesting with modern async/await, and simplify route controllers using express-async-errors.",
    readTime: "11 min",
    objectives: [
      "Refactor Promise .then() chains to synchronous-looking async/await syntax",
      "Manage rejected promises with try/catch blocks and next(exception)",
      "Eliminate repetitive try/catch boilerplate using the express-async-errors library",
      "Ensure unhandled rejections in route handlers are routed automatically to central error middleware",
      "Write clean, readable route handlers for CRUD operations",
      "Test async route exceptions and custom HTTP error status codes"
    ],
    theoryBlocks: [
      {
        heading: "Refactoring Promises to async/await",
        text: "The async/await syntax allows asynchronous JavaScript to read like synchronous code, making complex sequence logic much clearer.",
        codeSnippet: `// Before: Promise chaining\nNote.find({})\n  .then(notes => res.json(notes))\n  .catch(err => next(err));\n\n// After: async/await\nconst notes = await Note.find({});\nres.json(notes);`,
        mcq: {
          id: "q-4.3-0-v1",
          question: "What is required of a function before the 'await' keyword can be used inside its body?",
          options: [
            { id: "A", text: "The function must be explicitly declared with the 'async' keyword", explanationIfWrong: "In standard JavaScript, 'await' is only permitted inside an async function (or top-level modules)." },
            { id: "B", text: "The function must return an Array or Object literal", explanationIfWrong: "The return type does not dictate whether await is valid." },
            { id: "C", text: "The function must be imported from the 'async' npm package", explanationIfWrong: "async/await is built into JavaScript ES2017+; no external package is required." },
            { id: "D", text: "The function must take at least three arguments", explanationIfWrong: "Argument count has no bearing on async/await." }
          ],
          correctAnswer: "A",
          explanationNote: "The 'await' keyword can only be used inside functions declared with the 'async' modifier (or at the top level of ES modules)."
        },
        retestMcq: {
          id: "q-4.3-0-v2",
          question: "What does an async function always return in JavaScript?",
          options: [
            { id: "A", text: "A Promise that resolves with the function's returned value (or rejects with a thrown error)", explanationIfWrong: "Async functions always wrap their return value in a Promise." },
            { id: "B", text: "A synchronous callback function", explanationIfWrong: "Async functions return Promises, not callbacks." },
            { id: "C", text: "A Node.js Buffer instance", explanationIfWrong: "Async functions return Promises." },
            { id: "D", text: "undefined, unless res.send() is called explicitly", explanationIfWrong: "Async functions inherently return a Promise." }
          ],
          correctAnswer: "A",
          explanationNote: "Async functions always wrap their return value in a Promise, resolving with the returned value or rejecting if an exception is thrown."
        }
      },
      {
        heading: "Handling Errors with try/catch",
        text: "When an awaited Promise rejects, it throws an exception that must be caught with try/catch and passed to next(exception) in standard Express.",
        codeSnippet: `notesRouter.post('/', async (req, res, next) => {\n  try {\n    const note = new Note(req.body);\n    const savedNote = await note.save();\n    res.status(201).json(savedNote);\n  } catch (exception) {\n    next(exception);\n  }\n});`,
        mcq: {
          id: "q-4.3-1-v1",
          question: "In standard Express without helper libraries, what happens if an awaited promise rejects inside an async route handler without a try/catch?",
          options: [
            { id: "A", text: "The request hangs until timeout because the unhandled rejection is not passed to Express error middleware", explanationIfWrong: "Express 4 does not automatically catch unhandled promise rejections in route handlers." },
            { id: "B", text: "Express immediately sends a 404 Not Found response to the client", explanationIfWrong: "Without error handling, the server hangs or crashes; it does not send a 404." },
            { id: "C", text: "The client browser automatically retries the request 5 times", explanationIfWrong: "Browsers do not automatically retry timed-out POST requests." },
            { id: "D", text: "Mongoose recovers by saving default placeholder data", explanationIfWrong: "Mongoose throws validation or network errors; it does not invent placeholder data." }
          ],
          correctAnswer: "A",
          explanationNote: "In Express 4, unhandled promise rejections inside async route handlers are not caught automatically and can cause requests to hang indefinitely."
        },
        retestMcq: {
          id: "q-4.3-1-v2",
          question: "What argument must be passed to next() inside a catch block to invoke Express's central error handling middleware?",
          options: [
            { id: "A", text: "next(exception); passing the caught error object", explanationIfWrong: "Passing an argument to next() tells Express to bypass normal routes and jump to error middleware." },
            { id: "B", text: "next(); with no arguments", explanationIfWrong: "Calling next() with no arguments proceeds to the next normal route handler, ignoring the error." },
            { id: "C", text: "next('continue');", explanationIfWrong: "Any string argument is treated as an error message." },
            { id: "D", text: "next(res.status(500));", explanationIfWrong: "next() takes the error object, not a response invocation." }
          ],
          correctAnswer: "A",
          explanationNote: "Passing any argument to next(err) informs Express that an error occurred, skipping remaining standard middleware to execute error-handling middleware."
        }
      },
      {
        heading: "express-async-errors Magic",
        text: "The express-async-errors package eliminates manual try/catch boilerplate by automatically catching rejected promises under the hood.",
        codeSnippet: `// app.js (before loading routes):\nrequire('express-async-errors');\n\n// controllers/notes.js (No try/catch needed!):\nnotesRouter.delete('/:id', async (req, res) => {\n  await Note.findByIdAndDelete(req.params.id);\n  res.status(204).end();\n});`,
        mcq: {
          id: "q-4.3-2-v1",
          question: "Where must require('express-async-errors') be imported in your backend application?",
          options: [
            { id: "A", text: "In app.js before any route handlers or controllers are imported", explanationIfWrong: "It must patch Express route prototypes before any routes are registered." },
            { id: "B", text: "Inside package.json under the 'engines' key", explanationIfWrong: "Libraries must be required in executable JavaScript, not package.json metadata." },
            { id: "C", text: "At the end of each test file inside afterAll", explanationIfWrong: "It belongs in application runtime code (app.js), not inside test teardowns." },
            { id: "D", text: "Inside the MongoDB Atlas connection string URI", explanationIfWrong: "It is an npm package for Express, completely separate from database URIs." }
          ],
          correctAnswer: "A",
          explanationNote: "require('express-async-errors') must be called in app.js before routes are declared so it can patch Express's internal layer prototypes to catch async errors."
        },
        retestMcq: {
          id: "q-4.3-2-v2",
          question: "How does express-async-errors simplify route handler code?",
          options: [
            { id: "A", text: "It catches rejected promises from async route handlers behind the scenes and forwards them to next(error) automatically", explanationIfWrong: "It removes the need for repetitive try/catch and next(error) blocks in every controller." },
            { id: "B", text: "It prevents errors from ever occurring in JavaScript code", explanationIfWrong: "No library can prevent bugs or validation errors; it simply routes them to error middleware." },
            { id: "C", text: "It turns all HTTP POST endpoints into WebSocket subscriptions", explanationIfWrong: "It has nothing to do with WebSockets; it is purely an error-routing helper." },
            { id: "D", text: "It automatically generates Jest test files for each endpoint", explanationIfWrong: "It is a runtime middleware patch, not a test generator." }
          ],
          correctAnswer: "A",
          explanationNote: "With express-async-errors loaded, any exception thrown inside an async route handler is automatically forwarded to the central error handling middleware."
        }
      },
      {
        heading: "Streamlined CRUD Controllers",
        text: "With express-async-errors, controllers become concise and declarative, focusing purely on database operations and HTTP responses.",
        codeSnippet: `notesRouter.get('/:id', async (req, res) => {\n  const note = await Note.findById(req.params.id);\n  if (note) {\n    res.json(note);\n  } else {\n    res.status(404).end();\n  }\n});`,
        mcq: {
          id: "q-4.3-3-v1",
          question: "When querying by ID with findById(), what should the server return if no matching document exists?",
          options: [
            { id: "A", text: "HTTP 404 Not Found", explanationIfWrong: "When a queried entity does not exist in the database, 404 is the REST standard response." },
            { id: "B", text: "HTTP 500 Internal Server Error", explanationIfWrong: "A missing resource is a client-level 404, not a server malfunction (500)." },
            { id: "C", text: "HTTP 201 Created with an empty object", explanationIfWrong: "201 signifies successful resource creation, not missing entities." },
            { id: "D", text: "HTTP 301 Moved Permanently", explanationIfWrong: "301 is a redirection status code." }
          ],
          correctAnswer: "A",
          explanationNote: "If findById returns null (meaning the document ID is formatted validly but not present), returning 404 Not Found accurately reflects the state."
        },
        retestMcq: {
          id: "q-4.3-3-v2",
          question: "What HTTP status code and response body are standard when a resource is successfully deleted with findByIdAndDelete?",
          options: [
            { id: "A", text: "HTTP 204 No Content with res.status(204).end()", explanationIfWrong: "204 No Content indicates successful execution where no response body needs to be returned." },
            { id: "B", text: "HTTP 400 Bad Request with an error message", explanationIfWrong: "400 indicates client error, whereas deletion succeeded." },
            { id: "C", text: "HTTP 201 Created with the deleted item", explanationIfWrong: "201 is used for creating new resources, not deleting them." },
            { id: "D", text: "HTTP 502 Bad Gateway", explanationIfWrong: "502 indicates proxy/gateway failure, not successful deletion." }
          ],
          correctAnswer: "A",
          explanationNote: "Status 204 No Content is the standard REST response for successful deletions where no content needs to be returned to the client."
        }
      },
      {
        heading: "Helper Functions for Testing Datasets",
        text: "Extracting database inspection helpers into a tests/test_helper.js module keeps integration test files clean and reusable.",
        codeSnippet: `// tests/test_helper.js\nconst Note = require('../models/note');\nconst notesInDb = async () => {\n  const notes = await Note.find({});\n  return notes.map(note => note.toJSON());\n};\nmodule.exports = { notesInDb };`,
        mcq: {
          id: "q-4.3-4-v1",
          question: "What is the primary benefit of creating helper functions like notesInDb() for test files?",
          options: [
            { id: "A", text: "It encapsulates database inspection logic so tests can easily verify the current state of documents in the database", explanationIfWrong: "Reusable test helpers reduce boilerplate and make tests more readable and maintainable." },
            { id: "B", text: "It prevents Jest from running tests if the database contains records", explanationIfWrong: "Helpers assist tests; they do not disable Jest." },
            { id: "C", text: "It encrypts all test data so the database administrator cannot read it", explanationIfWrong: "Test helpers do not handle data encryption." },
            { id: "D", text: "It automatically translates JavaScript objects into SQL queries", explanationIfWrong: "Mongoose queries MongoDB; test helpers simply format the resulting documents." }
          ],
          correctAnswer: "A",
          explanationNote: "Test helpers like notesInDb() abstract recurring database queries, enabling test suites to cleanly inspect database contents before and after mutations."
        },
        retestMcq: {
          id: "q-4.3-4-v2",
          question: "Why does notesInDb() map retrieved documents with note.toJSON()?",
          options: [
            { id: "A", text: "To format Mongoose documents into plain JavaScript objects with transformed string IDs and removed __v properties", explanationIfWrong: "toJSON applies schema transformation options, providing clean plain objects." },
            { id: "B", text: "Because Jest cannot assert on any object that is not a raw JSON string", explanationIfWrong: "Jest asserts on plain JavaScript objects without difficulty." },
            { id: "C", text: "To compress documents before sending them over the internet", explanationIfWrong: "toJSON prepares plain objects, not network compression." },
            { id: "D", text: "To convert numbers to hexadecimal strings", explanationIfWrong: "toJSON formats fields according to schema transform rules." }
          ],
          correctAnswer: "A",
          explanationNote: "Calling note.toJSON() applies the schema's transform rules, replacing MongoDB's _id ObjectId with a clean string id and removing __v."
        }
      },
      {
        heading: "Testing Edge Cases & 400 Bad Request",
        text: "Unit and integration tests should thoroughly exercise boundary cases, such as verifying that missing required fields trigger 400 responses.",
        codeSnippet: `test('note without content is not added', async () => {\n  const newNote = { important: true };\n  await api\n    .post('/api/notes')\n    .send(newNote)\n    .expect(400);\n  const notesAtEnd = await helper.notesInDb();\n  expect(notesAtEnd).toHaveLength(helper.initialNotes.length);\n});`,
        mcq: {
          id: "q-4.3-5-v1",
          question: "When testing that invalid data is rejected, why is it important to check the database count at the end of the test?",
          options: [
            { id: "A", text: "To prove that despite any partial code execution, no invalid record was actually persisted to the database", explanationIfWrong: "Verifying unchanged record count confirms that the database was not mutated." },
            { id: "B", text: "Because Jest fails automatically if helper.notesInDb() is not called in every test", explanationIfWrong: "Jest does not require specific helper functions to be called." },
            { id: "C", text: "To reset the database connection timeout", explanationIfWrong: "Database connection timeouts are configured in connection options." },
            { id: "D", text: "To trigger garbage collection in the Node.js V8 engine", explanationIfWrong: "Checking database count verifies application business logic, not V8 garbage collection." }
          ],
          correctAnswer: "A",
          explanationNote: "Checking that the total database count remains unchanged guarantees that invalid submissions were fully rejected without leaving orphaned records."
        },
        retestMcq: {
          id: "q-4.3-5-v2",
          question: "If a client sends an invalid non-hexadecimal MongoDB ID (e.g. '123-invalid'), what status code should central error middleware return?",
          options: [
            { id: "A", text: "HTTP 400 Bad Request (CastError)", explanationIfWrong: "A malformed MongoDB ObjectId throws a CastError, which error middleware maps to 400." },
            { id: "B", text: "HTTP 200 OK with null", explanationIfWrong: "Malformed IDs are client errors and should return 400, not 200." },
            { id: "C", text: "HTTP 500 Internal Server Error", explanationIfWrong: "Client-submitted malformed IDs should be handled as 400, not internal server failures." },
            { id: "D", text: "HTTP 401 Unauthorized", explanationIfWrong: "401 represents authentication failure, not a malformed identifier." }
          ],
          correctAnswer: "A",
          explanationNote: "A malformed ObjectId triggers a Mongoose CastError. Central error handling middleware catches this and responds with 400 Bad Request: 'malformatted id'."
        }
      }
    ]
  },
  {
    id: "4-4-user-admin-bcrypt",
    number: "4.4",
    title: "User Administration & Password Hashing",
    subtitle: "Implement secure user accounts, hash passwords using bcrypt, enforce uniqueness constraints, and design relational database schemas.",
    readTime: "13 min",
    objectives: [
      "Understand why raw passwords must NEVER be saved in a database",
      "Hash passwords with salts using the bcrypt library",
      "Define User Mongoose schema with username, name, and passwordHash",
      "Enforce unique username constraints and validate minimum password length",
      "Create POST /api/users endpoint for secure registration",
      "Write integration tests verifying user creation and duplicate rejection"
    ],
    theoryBlocks: [
      {
        heading: "Never Store Plaintext Passwords",
        text: "Saving plaintext passwords compromises user accounts if a database leak occurs; one-way cryptographic hash functions generate irreversible digests.",
        codeSnippet: `// ❌ NEVER DO THIS:\nconst user = new User({ username, password });\n\n// ✅ ALWAYS STORE ONE-WAY HASH:\nconst passwordHash = await bcrypt.hash(password, saltRounds);\nconst user = new User({ username, passwordHash });`,
        mcq: {
          id: "q-4.4-0-v1",
          question: "Why must passwords never be saved in plaintext in a database?",
          options: [
            { id: "A", text: "If the database is leaked or accessed by unauthorized parties, all user passwords would be exposed directly", explanationIfWrong: "Plaintext storage is a catastrophic security vulnerability." },
            { id: "B", text: "Because MongoDB Atlas does not support strings containing letters and numbers", explanationIfWrong: "MongoDB supports all UTF-8 characters; hashing is strictly for security." },
            { id: "C", text: "Because plaintext strings occupy twice as much RAM as cryptographic hashes", explanationIfWrong: "Hash strings are often longer than short passwords; security is the reason." },
            { id: "D", text: "Because Express throws an error if an object contains a field named 'password'", explanationIfWrong: "Express has no restrictions on field names." }
          ],
          correctAnswer: "A",
          explanationNote: "Storing plaintext passwords exposes credentials in the event of a database compromise. Using irreversible hashes protects user identities."
        },
        retestMcq: {
          id: "q-4.4-0-v2",
          question: "What is a cryptographic hash function in the context of password security?",
          options: [
            { id: "A", text: "A one-way mathematical algorithm that computes a fixed-length fingerprint that cannot be practically reversed", explanationIfWrong: "A one-way hash cannot be reversed to discover the original password." },
            { id: "B", text: "A reversible encryption algorithm that decrypts passwords using a public key", explanationIfWrong: "Hashing is one-way (irreversible); encryption is two-way (reversible)." },
            { id: "C", text: "A database index that speeds up string sorting in MongoDB", explanationIfWrong: "Database indexing is unrelated to cryptographic hashing." },
            { id: "D", text: "A compression method that minimizes network bandwidth", explanationIfWrong: "Hashing is for authentication security, not file compression." }
          ],
          correctAnswer: "A",
          explanationNote: "Cryptographic hash functions are one-way algorithms: given a password, calculating the hash is trivial, but computing the password from the hash is computationally infeasible."
        }
      },
      {
        heading: "Password Hashing with bcrypt",
        text: "The bcrypt package hashes passwords using a computational work factor (salt rounds), protecting against dictionary and rainbow table attacks.",
        codeSnippet: `const bcrypt = require('bcrypt');\n\nconst saltRounds = 10;\nconst passwordHash = await bcrypt.hash(password, saltRounds);\n\n// To verify on login:\nconst isMatch = await bcrypt.compare(password, user.passwordHash);`,
        mcq: {
          id: "q-4.4-1-v1",
          question: "What is the purpose of 'salt rounds' when hashing a password with bcrypt?",
          options: [
            { id: "A", text: "It controls the computational cost of the hashing algorithm, making brute-force attacks significantly harder", explanationIfWrong: "Higher salt rounds increase the CPU time required to calculate each hash, slowing brute-force attempts." },
            { id: "B", text: "It determines how many times the user can attempt login before being locked out", explanationIfWrong: "Login attempt limits are handled by application logic/rate limiters, not salt rounds." },
            { id: "C", text: "It sets the maximum length of the user's password string", explanationIfWrong: "Salt rounds dictate hashing work factor, not character length limits." },
            { id: "D", text: "It specifies the number of databases where the password will be replicated", explanationIfWrong: "Salt rounds have nothing to do with database replication." }
          ],
          correctAnswer: "A",
          explanationNote: "Salt rounds determine the computational work factor (2^rounds iterations). A value of 10 balances fast user verification with strong brute-force resistance."
        },
        retestMcq: {
          id: "q-4.4-1-v2",
          question: "How does bcrypt securely verify whether a submitted password matches a stored passwordHash?",
          options: [
            { id: "A", text: "await bcrypt.compare(password, user.passwordHash); which hashes the input with the stored salt and compares the results", explanationIfWrong: "bcrypt.compare extracts the salt from the hash, hashes the candidate, and checks equality." },
            { id: "B", text: "bcrypt.decrypt(user.passwordHash) === password;", explanationIfWrong: "Hashes are one-way and cannot be decrypted." },
            { id: "C", text: "password === user.passwordHash;", explanationIfWrong: "The candidate password is plaintext while the stored value is a hash, so direct comparison fails." },
            { id: "D", text: "user.passwordHash.indexOf(password) !== -1;", explanationIfWrong: "The plaintext password does not appear as a substring inside the hash." }
          ],
          correctAnswer: "A",
          explanationNote: "bcrypt.compare() extracts the salt embedded inside the stored hash, hashes the submitted plaintext password with that exact salt, and checks if the hashes match."
        }
      },
      {
        heading: "User Mongoose Schema Definition",
        text: "The User schema stores username, name, passwordHash, and an array of ObjectId references pointing to the notes created by this user.",
        codeSnippet: `const userSchema = new mongoose.Schema({\n  username: { type: String, required: true, unique: true },\n  name: String,\n  passwordHash: String,\n  notes: [\n    { type: mongoose.Schema.Types.ObjectId, ref: 'Note' }\n  ]\n});`,
        mcq: {
          id: "q-4.4-2-v1",
          question: "In the User schema, why does the 'notes' field contain an array of ObjectId references with ref: 'Note'?",
          options: [
            { id: "A", text: "It defines a one-to-many relationship linking this user to their authored Note documents", explanationIfWrong: "ObjectId arrays with ref establish relational references between collections." },
            { id: "B", text: "It automatically copies the entire Note collection into every user document", explanationIfWrong: "Only ObjectIds are stored; full documents are not duplicated." },
            { id: "C", text: "It converts MongoDB from a document store into an Apache Kafka event queue", explanationIfWrong: "ref is a Mongoose schema property for relationship modeling." },
            { id: "D", text: "To prevent users from reading notes created by other users", explanationIfWrong: "ref establishes data relationships; authorization logic must be enforced in route code." }
          ],
          correctAnswer: "A",
          explanationNote: "Using { type: mongoose.Schema.Types.ObjectId, ref: 'Note' } tells Mongoose that this array holds IDs referencing documents in the 'Note' collection."
        },
        retestMcq: {
          id: "q-4.4-2-v2",
          question: "When returning user objects in API responses, what sensitive field should ALWAYS be deleted in the toJSON transform?",
          options: [
            { id: "A", text: "passwordHash", explanationIfWrong: "passwordHash must never be exposed to clients over API responses." },
            { id: "B", text: "username", explanationIfWrong: "Usernames are public identifiers needed by client applications." },
            { id: "C", text: "id", explanationIfWrong: "IDs are necessary for frontends to uniquely identify records." },
            { id: "D", text: "notes", explanationIfWrong: "The notes reference array is useful for displaying user content." }
          ],
          correctAnswer: "A",
          explanationNote: "The schema's toJSON transform should delete returnedObject.passwordHash so password hashes are never leaked in network responses."
        }
      },
      {
        heading: "Validating Password Length",
        text: "Password length must be validated in the route handler before hashing, because bcrypt transforms even empty strings into 60-character hashes.",
        codeSnippet: `usersRouter.post('/', async (req, res) => {\n  const { username, name, password } = req.body;\n  if (!password || password.length < 3) {\n    return res.status(400).json({ error: 'password must be at least 3 characters' });\n  }\n  const passwordHash = await bcrypt.hash(password, 10);\n  // proceed with user creation...\n});`,
        mcq: {
          id: "q-4.4-3-v1",
          question: "Why can't password minimum length be validated using standard Mongoose schema validators on the User model?",
          options: [
            { id: "A", text: "The Mongoose model only receives and stores the passwordHash, which is always 60 characters long regardless of password length", explanationIfWrong: "The database stores passwordHash, not the plaintext password, so schema length validators check the hash length." },
            { id: "B", text: "Because Mongoose does not support minimum length validation on strings", explanationIfWrong: "Mongoose supports minlength, but validating passwordHash would always yield length 60." },
            { id: "C", text: "Because bcrypt throws an uncatchable error if Mongoose validates passwords", explanationIfWrong: "bcrypt does not interact with Mongoose validators." },
            { id: "D", text: "Because password validation must only happen on the frontend", explanationIfWrong: "Backend validation is essential because frontend validation can be easily bypassed." }
          ],
          correctAnswer: "A",
          explanationNote: "Because the User schema stores passwordHash (which bcrypt generates as a fixed 60-character string), validating the plaintext password's length must occur in the controller before hashing."
        },
        retestMcq: {
          id: "q-4.4-3-v2",
          question: "What should the server respond if a client attempts to register an account with a 1-character password?",
          options: [
            { id: "A", text: "HTTP 400 Bad Request with an informative error message", explanationIfWrong: "Client input violating validation constraints should return 400." },
            { id: "B", text: "HTTP 201 Created and pad the password with spaces", explanationIfWrong: "Servers should never silently alter passwords." },
            { id: "C", text: "HTTP 500 Internal Server Error", explanationIfWrong: "Validation errors are client mistakes (400), not server bugs (500)." },
            { id: "D", text: "HTTP 404 Not Found", explanationIfWrong: "404 indicates missing endpoints/resources, not input validation failures." }
          ],
          correctAnswer: "A",
          explanationNote: "When registration payload fails validation constraints (such as minimum password length), the API must return 400 Bad Request with a descriptive error message."
        }
      },
      {
        heading: "Handling Duplicate Usernames",
        text: "Setting unique: true in Mongoose creates a unique MongoDB index, which throws a MongoServerError (E11000) when a duplicate username is registered.",
        codeSnippet: `// In central errorHandler middleware:\nif (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {\n  return res.status(400).json({ error: 'expected \`username\` to be unique' });\n}`,
        mcq: {
          id: "q-4.4-4-v1",
          question: "What MongoDB error code indicates a duplicate key violation when a unique index constraint is breached?",
          options: [
            { id: "A", text: "E11000", explanationIfWrong: "E11000 is MongoDB's duplicate key error code." },
            { id: "B", text: "E40400", explanationIfWrong: "E40400 is not a MongoDB error code." },
            { id: "C", text: "ECONNREFUSED", explanationIfWrong: "ECONNREFUSED is a network failure error code." },
            { id: "D", text: "ETIMEDOUT", explanationIfWrong: "ETIMEDOUT indicates an operation timeout." }
          ],
          correctAnswer: "A",
          explanationNote: "MongoDB raises an E11000 duplicate key error when an insert or update violates a unique index constraint (such as duplicate usernames)."
        },
        retestMcq: {
          id: "q-4.4-4-v2",
          question: "How should the central error handler format the response when catching an E11000 duplicate key error?",
          options: [
            { id: "A", text: "res.status(400).json({ error: 'expected \`username\` to be unique' })", explanationIfWrong: "Mapping the database error to a friendly 400 Bad Request informs the user properly." },
            { id: "B", text: "res.status(500).json({ error: 'Database crashed' })", explanationIfWrong: "Duplicate input is a client error (400), not an internal server crash (500)." },
            { id: "C", text: "res.status(200).send('User already exists but logged in')", explanationIfWrong: "Attempting to create a duplicate account should fail, not succeed." },
            { id: "D", text: "res.redirect('/home')", explanationIfWrong: "APIs should return JSON error payloads, not HTML redirects." }
          ],
          correctAnswer: "A",
          explanationNote: "When catching an E11000 error, the server should return HTTP 400 Bad Request with a clear message stating that the username must be unique."
        }
      },
      {
        heading: "Testing User Creation Integration",
        text: "Integration tests verify that valid users are created with HTTP 201, that duplicate usernames return 400, and that passwords are never stored in plaintext.",
        codeSnippet: `test('creation succeeds with a fresh username', async () => {\n  const usersAtStart = await helper.usersInDb();\n  const newUser = { username: 'root', name: 'Superuser', password: 'secret' };\n  await api.post('/api/users').send(newUser).expect(201);\n  const usersAtEnd = await helper.usersInDb();\n  expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);\n});`,
        mcq: {
          id: "q-4.4-5-v1",
          question: "In an automated test for POST /api/users, how should you verify that the password was hashed properly in the database?",
          options: [
            { id: "A", text: "Inspect the database record and verify that user.passwordHash exists and does NOT equal the plaintext password", explanationIfWrong: "Confirming that the stored value is an encrypted hash rather than plaintext ensures hashing succeeded." },
            { id: "B", text: "Verify that user.password is stored as an empty array", explanationIfWrong: "The field is passwordHash, and verifying it is not plaintext is the key check." },
            { id: "C", text: "Attempt to reverse the hash back to plaintext using JSON.parse()", explanationIfWrong: "Hashes are one-way cryptographic strings; JSON.parse cannot reverse them." },
            { id: "D", text: "Check that the HTTP response body contains the plaintext password", explanationIfWrong: "Responses should never include passwords or password hashes." }
          ],
          correctAnswer: "A",
          explanationNote: "Tests should inspect the created database entity directly, verifying that passwordHash exists and is different from the original plaintext password."
        },
        retestMcq: {
          id: "q-4.4-5-v2",
          question: "What should a test expect when attempting to register a user with an already existing username?",
          options: [
            { id: "A", text: "HTTP 400 Bad Request and the database user count remains unchanged", explanationIfWrong: "Duplicate registrations must be rejected with 400 without increasing the user count." },
            { id: "B", text: "HTTP 200 OK and the existing user's password is overwritten", explanationIfWrong: "Overwriting an existing account without authentication is a critical security bug." },
            { id: "C", text: "HTTP 204 No Content with a new random username generated", explanationIfWrong: "Servers must reject the invalid submission rather than inventing random usernames." },
            { id: "D", text: "HTTP 304 Not Modified", explanationIfWrong: "304 is for browser cache validation, not registration rejection." }
          ],
          correctAnswer: "A",
          explanationNote: "Registering a duplicate username must return HTTP 400 Bad Request and leave the total number of users in the database unchanged."
        }
      }
    ]
  },
  {
    id: "4-5-token-authentication-jwt",
    number: "4.5",
    title: "Token-Based Authentication with JWT",
    subtitle: "Implement stateless authentication using JSON Web Tokens, sign and verify digital tokens, and restrict route access using Authorization headers.",
    readTime: "14 min",
    objectives: [
      "Understand stateless token authentication vs traditional server sessions",
      "Generate and sign JSON Web Tokens with jsonwebtoken using a secret key",
      "Build POST /api/login endpoint to authenticate credentials and issue tokens",
      "Transmit tokens in HTTP request headers using the Bearer schema",
      "Verify and decode JWT tokens in protected Express route handlers",
      "Handle token expiration and invalid signature errors gracefully"
    ],
    theoryBlocks: [
      {
        heading: "Stateless Token Authentication",
        text: "In token-based authentication, the server signs a cryptographically secure token and sends it to the client; the client includes this token in subsequent requests.",
        codeSnippet: `// 1. Client logs in with credentials -> Server validates\n// 2. Server signs JWT: jwt.sign(payload, SECRET)\n// 3. Client stores token & sends in header: Authorization: Bearer <token>\n// 4. Server verifies signature: jwt.verify(token, SECRET)`,
        mcq: {
          id: "q-4.5-0-v1",
          question: "Why is token-based authentication described as 'stateless'?",
          options: [
            { id: "A", text: "The server does not need to store active session records in memory or a database; it simply verifies the cryptographic signature on each request", explanationIfWrong: "The token contains all required user info and can be verified mathematically without server state." },
            { id: "B", text: "Because the client is not allowed to store the token in local storage", explanationIfWrong: "Clients typically store tokens in local storage or memory." },
            { id: "C", text: "Because Express deletes all cookies after every HTTP request", explanationIfWrong: "Statelessness refers to the server not needing a session database." },
            { id: "D", text: "Because tokens can only be used once and immediately expire", explanationIfWrong: "Tokens remain valid until their designated expiration time." }
          ],
          correctAnswer: "A",
          explanationNote: "Stateless authentication means the server does not retain active session state in a store; the signed token carries identity information verified by the server's secret key."
        },
        retestMcq: {
          id: "q-4.5-0-v2",
          question: "What are the three parts of a JSON Web Token separated by dots (header.payload.signature)?",
          options: [
            { id: "A", text: "Header (algorithm), Payload (claims/data), and Signature (cryptographic hash)", explanationIfWrong: "A JWT consists of base64url-encoded header, payload, and signature." },
            { id: "B", text: "Username, Password, and Database URI", explanationIfWrong: "Passwords must never be included in a JWT." },
            { id: "C", text: "IP address, MAC address, and Operating System name", explanationIfWrong: "JWT structure consists of algorithm header, data payload, and signature." },
            { id: "D", text: "Encryption key, Decryption key, and Verification salt", explanationIfWrong: "The three parts are header, payload, and signature." }
          ],
          correctAnswer: "A",
          explanationNote: "A JWT is composed of three dot-separated Base64Url-encoded strings: Header (algorithm & token type), Payload (user data & claims), and Signature (HMAC/RSA digest)."
        }
      },
      {
        heading: "Signing Tokens with jsonwebtoken",
        text: "The jsonwebtoken library creates signed tokens using jwt.sign(). The payload should contain minimal user data such as username and id.",
        codeSnippet: `const jwt = require('jsonwebtoken');\n\nconst userForToken = {\n  username: user.username,\n  id: user._id,\n};\n\nconst token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 });`,
        mcq: {
          id: "q-4.5-1-v1",
          question: "Why should sensitive information like user passwords NEVER be placed in a JWT payload?",
          options: [
            { id: "A", text: "The JWT payload is only Base64Url encoded, NOT encrypted; anyone with the token can decode and view the payload contents", explanationIfWrong: "JWTs are signed for integrity, not encrypted for secrecy; payload claims are easily read." },
            { id: "B", text: "Because jsonwebtoken throws a TypeError if a payload has more than two keys", explanationIfWrong: "Payloads can contain any number of keys." },
            { id: "C", text: "Because MongoDB Atlas rejects queries that contain decoded tokens", explanationIfWrong: "MongoDB is unaware of JWT structure." },
            { id: "D", text: "Because the signature requires the payload to be purely numeric", explanationIfWrong: "Payloads are JSON objects containing strings, numbers, etc." }
          ],
          correctAnswer: "A",
          explanationNote: "A JWT signature guarantees that the token has not been tampered with, but the payload is merely base64-encoded and can be read by anyone."
        },
        retestMcq: {
          id: "q-4.5-1-v2",
          question: "What does the 'expiresIn: 60 * 60' option do when signing a JWT with jwt.sign()?",
          options: [
            { id: "A", text: "It sets the token to expire 1 hour (3600 seconds) after generation, limiting the damage if a token is compromised", explanationIfWrong: "Expiring tokens reduce the window of vulnerability if a token is intercepted." },
            { id: "B", text: "It causes the Express server to restart every 60 minutes", explanationIfWrong: "expiresIn affects token validity, not server uptime." },
            { id: "C", text: "It requires the user to change their password every hour", explanationIfWrong: "It requires re-authentication or token refreshing, not password changes." },
            { id: "D", text: "It limits the user to a maximum of 60 requests per minute", explanationIfWrong: "Rate limiting is handled by separate middleware, not the JWT signature." }
          ],
          correctAnswer: "A",
          explanationNote: "Setting expiresIn limits the token's lifetime (e.g. 1 hour), after which jwt.verify will reject it with a TokenExpiredError."
        }
      },
      {
        heading: "The Login Endpoint (POST /api/login)",
        text: "The login endpoint finds the user by username, validates the password using bcrypt.compare(), and returns a signed token with username and name.",
        codeSnippet: `loginRouter.post('/', async (req, res) => {\n  const { username, password } = req.body;\n  const user = await User.findOne({ username });\n  const passwordCorrect = user === null\n    ? false\n    : await bcrypt.compare(password, user.passwordHash);\n  if (!(user && passwordCorrect)) {\n    return res.status(401).json({ error: 'invalid username or password' });\n  }\n  const token = jwt.sign({ username: user.username, id: user._id }, process.env.SECRET);\n  res.status(200).send({ token, username: user.username, name: user.name });\n});`,
        mcq: {
          id: "q-4.5-2-v1",
          question: "Why does the login route return a generic message 'invalid username or password' rather than specifying which one was wrong?",
          options: [
            { id: "A", text: "To prevent username enumeration attacks, where an attacker figures out which accounts exist on the system", explanationIfWrong: "Revealing whether a username exists helps attackers identify valid targets." },
            { id: "B", text: "Because bcrypt.compare() does not know whether the username exists", explanationIfWrong: "The route code checks both, but intentionally returns a generic message for security." },
            { id: "C", text: "Because HTTP 401 Unauthorized cannot contain a response body", explanationIfWrong: "401 responses can and should contain JSON error details." },
            { id: "D", text: "Because Express limits error strings to under 30 characters", explanationIfWrong: "Express has no such string length limit." }
          ],
          correctAnswer: "A",
          explanationNote: "Generic error messages ('invalid username or password') protect against username enumeration, preventing attackers from probing which usernames exist."
        },
        retestMcq: {
          id: "q-4.5-2-v2",
          question: "What HTTP status code is appropriate when a login attempt fails due to incorrect credentials?",
          options: [
            { id: "A", text: "HTTP 401 Unauthorized", explanationIfWrong: "401 Unauthorized is the exact HTTP specification for missing or invalid authentication credentials." },
            { id: "B", text: "HTTP 404 Not Found", explanationIfWrong: "404 indicates missing endpoints or resources, not authentication failure." },
            { id: "C", text: "HTTP 500 Internal Server Error", explanationIfWrong: "Wrong credentials is a client authentication failure, not a server crash." },
            { id: "D", text: "HTTP 200 OK with success: false", explanationIfWrong: "REST conventions require standard 4xx error status codes for client failures." }
          ],
          correctAnswer: "A",
          explanationNote: "HTTP 401 Unauthorized is the standard status code indicating that the client's request lacked valid authentication credentials."
        }
      },
      {
        heading: "Transmitting Tokens with Bearer Schema",
        text: "Clients send tokens in the HTTP Authorization header using the Bearer schema format: Authorization: Bearer <token>.",
        codeSnippet: `// Client request header:\n// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\n\n// Server helper to extract token:\nconst getTokenFrom = request => {\n  const authorization = request.get('authorization');\n  if (authorization && authorization.startsWith('Bearer ')) {\n    return authorization.replace('Bearer ', '');\n  }\n  return null;\n};`,
        mcq: {
          id: "q-4.5-3-v1",
          question: "What is the standard HTTP header used to transmit an authentication token from client to server?",
          options: [
            { id: "A", text: "Authorization: Bearer <token>", explanationIfWrong: "The standard header is Authorization with the Bearer scheme." },
            { id: "B", text: "X-Auth-Token-Payload: <token>", explanationIfWrong: "While custom headers can be used, 'Authorization: Bearer' is the RFC 6750 standard." },
            { id: "C", text: "Cookie-User-Secret: <token>", explanationIfWrong: "Cookie-User-Secret is not a recognized standard authentication header." },
            { id: "D", text: "Content-Type: Bearer <token>", explanationIfWrong: "Content-Type specifies media type (e.g. application/json), not credentials." }
          ],
          correctAnswer: "A",
          explanationNote: "RFC 6750 establishes the 'Authorization: Bearer <token>' header as the standard format for passing bearer tokens in HTTP requests."
        },
        retestMcq: {
          id: "q-4.5-3-v2",
          question: "If an incoming request header is 'Bearer eyJhbGci...', how can Express code extract just the token string?",
          options: [
            { id: "A", text: "req.get('authorization').replace('Bearer ', '')", explanationIfWrong: "Stripping the 'Bearer ' prefix isolates the raw token string." },
            { id: "B", text: "req.body.token", explanationIfWrong: "Headers are read from req.get(), not req.body." },
            { id: "C", text: "req.params.authorization", explanationIfWrong: "req.params contains URL route parameters, not HTTP headers." },
            { id: "D", text: "req.query.bearer", explanationIfWrong: "req.query contains URL query string parameters, not headers." }
          ],
          correctAnswer: "A",
          explanationNote: "req.get('authorization') retrieves the header value, and replacing 'Bearer ' yields the clean encoded token string."
        }
      },
      {
        heading: "Token Verification in Protected Routes",
        text: "Protected route handlers call jwt.verify() with the token and secret key; if valid, the decoded payload provides the authenticated user's ID.",
        codeSnippet: `notesRouter.post('/', async (req, res) => {\n  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);\n  if (!decodedToken.id) {\n    return res.status(401).json({ error: 'token invalid' });\n  }\n  const user = await User.findById(decodedToken.id);\n  const note = new Note({ ...req.body, user: user._id });\n  const savedNote = await note.save();\n  user.notes = user.notes.concat(savedNote._id);\n  await user.save();\n  res.status(201).json(savedNote);\n});`,
        mcq: {
          id: "q-4.5-4-v1",
          question: "What happens if jwt.verify() is passed an expired token or a token with an invalid signature?",
          options: [
            { id: "A", text: "It throws an error (e.g. JsonWebTokenError or TokenExpiredError)", explanationIfWrong: "jwt.verify throws exceptions when signatures don't match or tokens expire." },
            { id: "B", text: "It returns null without throwing an exception", explanationIfWrong: "jwt.verify throws an exception rather than returning null." },
            { id: "C", text: "It automatically generates a new valid token for the client", explanationIfWrong: "Verification does not issue new tokens." },
            { id: "D", text: "It deletes the user from the database", explanationIfWrong: "Token verification has no side-effects on database records." }
          ],
          correctAnswer: "A",
          explanationNote: "jwt.verify() throws an exception (such as JsonWebTokenError or TokenExpiredError) if the token signature is tampered with or if the expiration time has elapsed."
        },
        retestMcq: {
          id: "q-4.5-4-v2",
          question: "How should the central errorHandler middleware handle a JsonWebTokenError thrown by jwt.verify?",
          options: [
            { id: "A", text: "Catch error.name === 'JsonWebTokenError' and return res.status(401).json({ error: 'token invalid' })", explanationIfWrong: "Translating JWT errors to 401 Unauthorized provides proper client feedback." },
            { id: "B", text: "Catch error and return res.status(500).json({ error: 'Server crashed' })", explanationIfWrong: "Invalid client tokens are 401 client errors, not 500 server crashes." },
            { id: "C", text: "Ignore the error and allow the route handler to continue", explanationIfWrong: "Ignoring the error would grant unauthenticated access." },
            { id: "D", text: "Return HTTP 200 with an empty array", explanationIfWrong: "Authentication failure must return an HTTP 4xx error code." }
          ],
          correctAnswer: "A",
          explanationNote: "The central error middleware checks for error.name === 'JsonWebTokenError' or 'TokenExpiredError' and returns status 401 Unauthorized with a clear message."
        }
      },
      {
        heading: "Custom Token Extractor Middleware",
        text: "Refactoring token extraction into a custom middleware (tokenExtractor) attaches the parsed token directly to req.token for all routes.",
        codeSnippet: `// utils/middleware.js:\nconst tokenExtractor = (req, res, next) => {\n  const authorization = req.get('authorization');\n  if (authorization && authorization.startsWith('Bearer ')) {\n    req.token = authorization.replace('Bearer ', '');\n  } else {\n    req.token = null;\n  }\n  next();\n};\nmodule.exports = { tokenExtractor };`,
        mcq: {
          id: "q-4.5-5-v1",
          question: "Why is creating a tokenExtractor middleware preferable to calling a helper function inside every protected route?",
          options: [
            { id: "A", text: "It isolates request parsing into Express middleware, making req.token cleanly accessible across any controller without code duplication", explanationIfWrong: "Middleware extracts and attaches data once, keeping route controllers clean and DRY." },
            { id: "B", text: "Because Express does not allow helper functions inside controllers", explanationIfWrong: "Helper functions are allowed, but middleware adheres to the pipeline architecture." },
            { id: "C", text: "Because tokenExtractor bypasses the need for process.env.SECRET", explanationIfWrong: "The secret is still required for signature verification." },
            { id: "D", text: "Because middleware runs after the response has been sent to the client", explanationIfWrong: "Middleware runs before the route handler, enriching the request object." }
          ],
          correctAnswer: "A",
          explanationNote: "Middleware follows Express's pipeline architecture, parsing the header once and attaching req.token so all downstream route handlers can access it cleanly."
        },
        retestMcq: {
          id: "q-4.5-5-v2",
          question: "What must every custom Express middleware call at the end of its execution to prevent requests from hanging?",
          options: [
            { id: "A", text: "next(); to pass control to the subsequent middleware or route handler", explanationIfWrong: "Without calling next(), the request pipeline halts and the client hangs." },
            { id: "B", text: "res.end(); immediately", explanationIfWrong: "res.end terminates the response prematurely before routes execute." },
            { id: "C", text: "process.exit();", explanationIfWrong: "process.exit kills the entire Node.js server process." },
            { id: "D", text: "app.listen();", explanationIfWrong: "app.listen starts the server and is only called once at startup." }
          ],
          correctAnswer: "A",
          explanationNote: "Custom middleware must invoke next() to pass execution to the next middleware or route handler in the Express request-response cycle."
        }
      }
    ]
  },
  {
    id: "4-6-database-relations-populate",
    number: "4.6",
    title: "Database Relations & Mongoose Populate",
    subtitle: "Model relational references in document databases, use Mongoose populate() for schema joins, and enforce user authorization policies.",
    readTime: "13 min",
    objectives: [
      "Model document relationships in MongoDB using ObjectId references",
      "Understand how document databases handle relational data compared to SQL JOINs",
      "Use Mongoose populate() to replace referenced ObjectIds with actual documents",
      "Selectively include or exclude populated fields for performance and security",
      "Enforce authorization: ensure only the author can delete or modify a resource",
      "Write integration tests verifying populated response structures and authorization rules"
    ],
    theoryBlocks: [
      {
        heading: "Relational References in MongoDB",
        text: "Unlike SQL foreign keys with strict constraints, MongoDB models relationships by storing document ObjectIds in reference fields.",
        codeSnippet: `// Note Schema:\nconst noteSchema = new mongoose.Schema({\n  content: String,\n  important: Boolean,\n  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }\n});`,
        mcq: {
          id: "q-4.6-0-v1",
          question: "How does storing document references in MongoDB differ fundamentally from SQL relational foreign keys?",
          options: [
            { id: "A", text: "MongoDB does not automatically enforce transactional foreign key constraints; references are simply ObjectIds stored as field values", explanationIfWrong: "MongoDB does not maintain schema-level foreign key constraints like traditional SQL databases." },
            { id: "B", text: "MongoDB requires all related tables to be stored in the same hard drive sector", explanationIfWrong: "Physical hardware sectors have nothing to do with database relational modeling." },
            { id: "C", text: "SQL databases cannot store numbers, whereas MongoDB can", explanationIfWrong: "Both database types support numeric types." },
            { id: "D", text: "MongoDB prohibits documents from ever referencing another collection", explanationIfWrong: "Document references are a standard pattern in MongoDB and Mongoose." }
          ],
          correctAnswer: "A",
          explanationNote: "MongoDB is a document store without built-in relational integrity constraints; foreign keys are simply ObjectIds pointing to documents in another collection."
        },
        retestMcq: {
          id: "q-4.6-0-v2",
          question: "In Mongoose, what does the ref property (e.g. ref: 'User') signify in a schema definition?",
          options: [
            { id: "A", text: "It tells Mongoose which model to look up when the populate() method is called on that field", explanationIfWrong: "ref informs Mongoose which model schema to query when populating referenced IDs." },
            { id: "B", text: "It prevents users from deleting the document", explanationIfWrong: "ref does not restrict deletion; it only specifies the referenced model." },
            { id: "C", text: "It automatically creates a GitHub pull request when records are saved", explanationIfWrong: "Mongoose has no connection to GitHub." },
            { id: "D", text: "It encrypts the referenced ObjectId using AES-256", explanationIfWrong: "ref is metadata for joins; it does not encrypt ObjectIds." }
          ],
          correctAnswer: "A",
          explanationNote: "The ref option tells Mongoose which registered model to query when populate() is used to replace an ObjectId with the actual referenced document."
        }
      },
      {
        heading: "Using Mongoose populate()",
        text: "Mongoose's populate() method performs an additional query behind the scenes to replace referenced ObjectIds with the full document data.",
        codeSnippet: `// GET /api/notes:\nconst notes = await Note\n  .find({})\n  .populate('user', { username: 1, name: 1 });\nres.json(notes);`,
        mcq: {
          id: "q-4.6-1-v1",
          question: "What does the second argument { username: 1, name: 1 } passed to populate('user', ...) do?",
          options: [
            { id: "A", text: "It selects only the username and name fields from the User document, omitting other fields like passwordHash", explanationIfWrong: "Field selection projections limit which properties of the referenced document are retrieved." },
            { id: "B", text: "It specifies that exactly 1 user can be populated per query", explanationIfWrong: "Numbers 1 and 0 are projection flags (include/exclude), not document count limits." },
            { id: "C", text: "It sorts the populated users alphabetically by username", explanationIfWrong: "Sorting is handled by .sort(), not field selection projection." },
            { id: "D", text: "It forces the user to have at least 1 note to be populated", explanationIfWrong: "Field selection restricts returned properties, not document filters." }
          ],
          correctAnswer: "A",
          explanationNote: "Field projection { username: 1, name: 1 } ensures that only the needed public fields of the referenced User are returned, keeping sensitive fields like passwordHash secure."
        },
        retestMcq: {
          id: "q-4.6-1-v2",
          question: "How does Mongoose populate() implement its join behind the scenes in MongoDB?",
          options: [
            { id: "A", text: "It executes multiple sequential queries under the hood (one for the main collection, then queries to fetch the referenced documents by ID)", explanationIfWrong: "Mongoose populate is implemented on the application layer by issuing supplementary queries." },
            { id: "B", text: "It executes a native C-level hardware pointer dereference inside the CPU", explanationIfWrong: "MongoDB does not perform pointer dereferencing; Mongoose sends queries to the database." },
            { id: "C", text: "It converts all documents into a single flat CSV file", explanationIfWrong: "Populate is a software abstraction returning structured JavaScript objects." },
            { id: "D", text: "It modifies the MongoDB server source code dynamically", explanationIfWrong: "Populate is purely a feature of the Mongoose client library." }
          ],
          correctAnswer: "A",
          explanationNote: "Mongoose's populate() operates at the application level: it retrieves the primary documents, extracts referenced IDs, queries the referenced collection, and merges the results."
        }
      },
      {
        heading: "Bidirectional Relationships",
        text: "When a new resource is created, both the resource's user field and the user's notes array must be updated and saved to maintain bidirectional consistency.",
        codeSnippet: `const note = new Note({ content, important, user: user._id });\nconst savedNote = await note.save();\n\nuser.notes = user.notes.concat(savedNote._id);\nawait user.save();`,
        mcq: {
          id: "q-4.6-2-v1",
          question: "Why should both the Note document and the User document be saved when a new note is created?",
          options: [
            { id: "A", text: "To maintain two-way consistency: the Note references its author, and the User's notes array references the new Note", explanationIfWrong: "Saving both documents ensures that both sides of the relationship remain updated." },
            { id: "B", text: "Because Mongoose will throw a FatalError if user.save() is not called immediately", explanationIfWrong: "Mongoose does not enforce bidirectional updates automatically; developers manage consistency." },
            { id: "C", text: "To duplicate the note content inside the user's collection", explanationIfWrong: "Only the note's ObjectId is saved in the user's notes array." },
            { id: "D", text: "To trigger an automatic email notification to the user", explanationIfWrong: "Saving documents merely updates database state; it does not send emails." }
          ],
          correctAnswer: "A",
          explanationNote: "Because MongoDB lacks automatic join tables, updating both note.user and user.notes ensures bidirectional queries (user's notes and note's creator) remain fast and consistent."
        },
        retestMcq: {
          id: "q-4.6-2-v2",
          question: "What is stored in the User document's 'notes' array in this design pattern?",
          options: [
            { id: "A", text: "An array of Note ObjectIds referencing documents in the notes collection", explanationIfWrong: "Referencing by ObjectId keeps the user document small and avoids data duplication." },
            { id: "B", text: "The full JSON string of all notes created by all users", explanationIfWrong: "Only the IDs of notes created by this specific user are stored." },
            { id: "C", text: "A count number representing total notes", explanationIfWrong: "It is an array of ObjectIds, not a primitive count number." },
            { id: "D", text: "The user's encrypted master password", explanationIfWrong: "The notes array is dedicated strictly to note references." }
          ],
          correctAnswer: "A",
          explanationNote: "The User document stores an array of Note ObjectIds, which can be populated with .populate('notes') whenever the user's full notes list is requested."
        }
      },
      {
        heading: "Enforcing Authorization on Mutations",
        text: "Authentication verifies who the user is; authorization checks whether the authenticated user has permission to delete or modify the target resource.",
        codeSnippet: `notesRouter.delete('/:id', async (req, res) => {\n  const decodedToken = jwt.verify(req.token, process.env.SECRET);\n  const note = await Note.findById(req.params.id);\n  if (!note) return res.status(404).end();\n\n  if (note.user.toString() !== decodedToken.id.toString()) {\n    return res.status(403).json({ error: 'only the creator can delete this note' });\n  }\n  await Note.findByIdAndDelete(req.params.id);\n  res.status(204).end();\n});`,
        mcq: {
          id: "q-4.6-3-v1",
          question: "Why must note.user.toString() be compared with decodedToken.id.toString() rather than using note.user === decodedToken.id?",
          options: [
            { id: "A", text: "note.user is a Mongoose ObjectId object, not a string; using === compares object references which are never equal", explanationIfWrong: "ObjectIds are JavaScript objects; comparing them with === checks reference identity, not string value." },
            { id: "B", text: "Because JavaScript does not allow strict equality comparison in Express controllers", explanationIfWrong: "=== is standard JavaScript and works everywhere; the issue is object references vs string values." },
            { id: "C", text: "Because decodedToken.id is a floating-point integer", explanationIfWrong: "The ID in a decoded token is a string representation of the ObjectId." },
            { id: "D", text: "Because toString() encrypts the IDs before comparison", explanationIfWrong: "toString() merely converts the ObjectId object into its plain hex string representation." }
          ],
          correctAnswer: "A",
          explanationNote: "MongoDB ObjectIds are complex objects. Direct comparison (note.user === decodedToken.id) fails because two distinct objects never share reference equality; converting both with .toString() ensures accurate string comparison."
        },
        retestMcq: {
          id: "q-4.6-3-v2",
          question: "What HTTP status code represents an authorization failure, where the user is authenticated but lacks permission to delete a resource?",
          options: [
            { id: "A", text: "HTTP 403 Forbidden", explanationIfWrong: "403 Forbidden indicates the server understands who the user is, but refuses authorization." },
            { id: "B", text: "HTTP 401 Unauthorized", explanationIfWrong: "401 indicates missing or invalid credentials (unauthenticated), whereas 403 is unauthorized." },
            { id: "C", text: "HTTP 404 Not Found", explanationIfWrong: "404 indicates the resource does not exist, not that access is forbidden." },
            { id: "D", text: "HTTP 500 Internal Server Error", explanationIfWrong: "Authorization failure is an expected security enforcement, not a server crash." }
          ],
          correctAnswer: "A",
          explanationNote: "HTTP 403 Forbidden is the proper code when the user's identity is authenticated, but they lack the privileges required to modify or delete the specific resource."
        }
      },
      {
        heading: "User Extractor Middleware",
        text: "A userExtractor middleware verifies the token, queries the User document from the database, and binds it to req.user for routes requiring user access.",
        codeSnippet: `// utils/middleware.js:\nconst userExtractor = async (req, res, next) => {\n  if (req.token) {\n    const decodedToken = jwt.verify(req.token, process.env.SECRET);\n    if (decodedToken.id) {\n      req.user = await User.findById(decodedToken.id);\n    }\n  }\n  next();\n};`,
        mcq: {
          id: "q-4.6-4-v1",
          question: "What is the key advantage of a userExtractor middleware over manually verifying tokens in each route?",
          options: [
            { id: "A", text: "It eliminates repetitive token verification and database lookups, providing req.user directly to all authorized route handlers", explanationIfWrong: "Centralizing authentication and user resolution keeps controllers focused on domain logic." },
            { id: "B", text: "It allows unauthenticated users to create resources without a token", explanationIfWrong: "The middleware resolves the user if a valid token is present; it does not bypass security." },
            { id: "C", text: "It replaces the need for Mongoose models", explanationIfWrong: "userExtractor queries the Mongoose User model." },
            { id: "D", text: "It generates a new MongoDB collection on every request", explanationIfWrong: "Middleware processes requests; it does not create collections." }
          ],
          correctAnswer: "A",
          explanationNote: "userExtractor centralizes token verification and user lookup into reusable middleware, populating req.user so protected routes don't repeat that logic."
        },
        retestMcq: {
          id: "q-4.6-4-v2",
          question: "If an endpoint requires userExtractor, how can it be applied specifically to only that router in app.js?",
          options: [
            { id: "A", text: "app.use('/api/blogs', userExtractor, blogsRouter);", explanationIfWrong: "Passing middleware before the router applies it specifically to requests hitting that path." },
            { id: "B", text: "blogsRouter.use(userExtractor.only());", explanationIfWrong: "Middleware is passed directly as an argument, not invoked with .only()." },
            { id: "C", text: "app.attach('/api/blogs', userExtractor);", explanationIfWrong: "Express uses app.use(), not app.attach()." },
            { id: "D", text: "userExtractor.bind(blogsRouter);", explanationIfWrong: "Express routes and middleware are chained using app.use or router.use." }
          ],
          correctAnswer: "A",
          explanationNote: "app.use('/api/blogs', userExtractor, blogsRouter) mounts the userExtractor middleware specifically for all requests targeted to the '/api/blogs' prefix."
        }
      },
      {
        heading: "Full Stack Open Part 4 Certification",
        text: "Part 4 equips you with enterprise backend skills: modular project structure, Jest/Supertest integration testing, bcrypt password hashing, and JWT token authentication.",
        codeSnippet: `// Complete Backend Flow:\n// 1. Tests in tests/ verify endpoints using supertest\n// 2. Passwords hashed with bcrypt before saving to MongoDB\n// 3. Login returns signed JWT token\n// 4. Token extracted & verified in middleware\n// 5. Relations populated with Mongoose populate()`,
        mcq: {
          id: "q-4.6-5-v1",
          question: "Which of the following summaries accurately reflects the complete authentication and testing architecture mastered in Part 4?",
          options: [
            { id: "A", text: "Express modular routers, automated Supertest API tests against a test database, bcrypt password hashing, and stateless JWT token authentication", explanationIfWrong: "This correctly summarizes the complete Part 4 full stack architecture." },
            { id: "B", text: "Plaintext password storage in cookies with manual browser testing and no automated test suites", explanationIfWrong: "Part 4 emphasizes automated testing and secure password hashing with bcrypt." },
            { id: "C", text: "Direct SQL queries executed through browser JavaScript without an Express server", explanationIfWrong: "Part 4 uses Node.js, Express, and MongoDB with Mongoose." },
            { id: "D", text: "Client-side state management using Redux and React Context without backend databases", explanationIfWrong: "Part 4 is focused entirely on backend architecture, testing, and user authentication." }
          ],
          correctAnswer: "A",
          explanationNote: "Part 4 masterfully integrates modular Express routing, Jest and Supertest automated testing, bcrypt password hashing, and stateless JWT token authentication."
        },
        retestMcq: {
          id: "q-4.6-5-v2",
          question: "What is the primary benefit of having a comprehensive automated integration test suite before deploying to production?",
          options: [
            { id: "A", text: "It allows developers to refactor and expand backend features with confidence that existing functionality and security rules remain unbroken", explanationIfWrong: "Automated regression tests ensure modifications do not break existing behaviors or security constraints." },
            { id: "B", text: "It eliminates the need for database backups", explanationIfWrong: "Testing does not replace regular disaster recovery database backups." },
            { id: "C", text: "It forces the server to run without an internet connection", explanationIfWrong: "Production servers require network connections for client traffic." },
            { id: "D", text: "It prevents users from ever submitting invalid passwords", explanationIfWrong: "Tests verify code correctness; runtime validation handles user submissions." }
          ],
          correctAnswer: "A",
          explanationNote: "A robust automated test suite guards against regressions, enabling safe refactoring, dependency updates, and continuous integration with high confidence."
        }
      }
    ]
  }
];

// Helper functions for Level attempts, question selection, and 3-consecutive-failure progression lock
export const getLevelAttemptCountFullstackPart4 = (sectionId: string, studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_fullstack_p4_attempt_${sectionId}_${studentId}`);
    return saved ? Number(saved) : 1;
  } catch {
    return 1;
  }
};

export const setLevelAttemptCountFullstackPart4 = (sectionId: string, studentId: string, count: number): void => {
  try {
    localStorage.setItem(`dopilot_fullstack_p4_attempt_${sectionId}_${studentId}`, String(count));
  } catch {}
};

export const getActiveQuestionsForLevelFullstackPart4 = (
  section: SectionContent,
  studentId: string,
  forceRetest: boolean = false
): McqQuestion[] => {
  const attempt = forceRetest ? 2 : getLevelAttemptCountFullstackPart4(section.id, studentId);
  return section.theoryBlocks.map((block) => {
    if (attempt >= 2 && block.retestMcq) {
      return block.retestMcq;
    }
    return block.mcq!;
  });
};

export const getConsecutiveFailedLevelsFullstackPart4 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_fullstack_p4_failed_levels_streak_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const recordLevelAttemptResultFullstackPart4 = (
  sectionId: string,
  studentId: string,
  isPassed: boolean
): {
  isPassed: boolean;
  attemptCount: number;
  isSecondFailureInLevel: boolean;
  consecutiveFailedLevels: number;
  isLocked: boolean;
} => {
  const currentAttempt = getLevelAttemptCountFullstackPart4(sectionId, studentId);

  if (isPassed) {
    try {
      localStorage.setItem(`dopilot_fullstack_p4_failed_levels_streak_${studentId}`, '0');
      localStorage.setItem(`dopilot_fullstack_p4_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_fullstack_p4_attempt_${sectionId}_${studentId}`, '1');
      localStorage.removeItem(`dopilot_fullstack_p4_locked_${studentId}`);
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
      setLevelAttemptCountFullstackPart4(sectionId, studentId, 2);
      const streak = getConsecutiveFailedLevelsFullstackPart4(studentId);

      return {
        isPassed: false,
        attemptCount: 1,
        isSecondFailureInLevel: false,
        consecutiveFailedLevels: streak,
        isLocked: false
      };
    } else {
      const prevStreak = getConsecutiveFailedLevelsFullstackPart4(studentId);
      const newStreak = prevStreak + 1;
      const isLocked = newStreak >= 3;

      try {
        localStorage.setItem(`dopilot_fullstack_p4_failed_levels_streak_${studentId}`, String(newStreak));
        localStorage.setItem(`dopilot_fullstack_p4_consecutive_failures_${studentId}`, String(newStreak));
        if (isLocked) {
          localStorage.setItem(`dopilot_fullstack_p4_locked_${studentId}`, 'true');
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

export const resetConsecutiveFailuresFullstackPart4 = (studentId: string): void => {
  try {
    localStorage.setItem(`dopilot_fullstack_p4_consecutive_failures_${studentId}`, '0');
    localStorage.setItem(`dopilot_fullstack_p4_failed_levels_streak_${studentId}`, '0');
    localStorage.removeItem(`dopilot_fullstack_p4_locked_${studentId}`);
  } catch {}
};
