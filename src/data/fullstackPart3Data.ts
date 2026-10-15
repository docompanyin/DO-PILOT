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

export const FULLSTACK_PART_3_SECTIONS: SectionContent[] = [
  {
    id: "3-1-nodejs-express-setup",
    number: "3.1",
    title: "Node.js Runtime & Express Server Setup",
    subtitle: "Initialize Node.js projects, build HTTP servers with Express, configure port listening, and use nodemon for live reloading.",
    readTime: "12 min",
    objectives: [
      "Understand the Node.js runtime and its asynchronous, event-driven I/O model",
      "Initialize projects with npm init and manage package.json dependencies",
      "Create and start an Express web server using app.listen()",
      "Define standard GET routes with request and response parameters",
      "Configure nodemon to automatically restart the server on file changes",
      "Differentiate between Node.js server execution and browser JavaScript"
    ],
    theoryBlocks: [
      {
        heading: "The Node.js Runtime Environment",
        text: "Node.js is a server-side JavaScript runtime built on Google Chrome's V8 engine. It allows running JavaScript directly on operating systems outside the browser.",
        codeSnippet: `// index.js:\nconsole.log('Hello from Node.js server!');\n// Run in terminal: node index.js`,
        terminalOutput: `Hello from Node.js server!`,
        mcq: {
          id: "q-3.1-0-v1",
          question: "What is Node.js in the modern full-stack development ecosystem?",
          options: [
            { id: "A", text: "A JavaScript runtime built on Chrome's V8 engine that executes JavaScript on the server", explanationIfWrong: "" },
            { id: "B", text: "A frontend CSS styling framework similar to Tailwind", explanationIfWrong: "Node.js is a backend runtime, not a CSS library." },
            { id: "C", text: "A relational SQL database management system", explanationIfWrong: "Node.js is an execution environment, not a database." },
            { id: "D", text: "A browser extension for debugging React components", explanationIfWrong: "Node.js runs standalone on the OS, not as a browser extension." }
          ],
          correctAnswer: "A",
          explanationNote: "Node.js provides a cross-platform runtime environment that executes JavaScript outside web browsers, powering backend servers."
        },
        retestMcq: {
          id: "q-3.1-0-v2",
          question: "Which browser-specific global object is NOT available in the Node.js backend environment?",
          options: [
            { id: "A", text: "`window` and `document`", explanationIfWrong: "" },
            { id: "B", text: "`console`", explanationIfWrong: "console is available in both Node.js and browsers." },
            { id: "C", text: "`setTimeout`", explanationIfWrong: "setTimeout is a global timer available in Node.js." },
            { id: "D", text: "`Math`", explanationIfWrong: "Math is a standard ECMAScript global available everywhere." }
          ],
          correctAnswer: "A",
          explanationNote: "Because Node.js runs on the server without a graphical viewport, browser DOM globals like `window` and `document` do not exist."
        }
      },
      {
        heading: "Creating an Express Application",
        text: "Express is the standard minimal web framework for Node.js. It simplifies routing, HTTP request handling, and middleware composition.",
        codeSnippet: `const express = require('express');\nconst app = express();\n\napp.get('/', (request, response) => {\n  response.send('<h1>Hello Full Stack!</h1>');\n});\n\nconst PORT = 3001;\napp.listen(PORT, () => {\n  console.log(\`Server running on port \${PORT}\`);\n});`,
        terminalOutput: `Server running on port 3001 -> GET / returns HTML`,
        mcq: {
          id: "q-3.1-1-v1",
          question: "In Express, what does the `app.get('/', (request, response) => ...)` method do?",
          options: [
            { id: "A", text: "It registers a route handler that executes whenever an HTTP GET request targets the root URL path", explanationIfWrong: "" },
            { id: "B", text: "It sends a GET request to an external server like Axios", explanationIfWrong: "app.get() defines a server route; it does not make client requests." },
            { id: "C", text: "It connects the application to a MongoDB database", explanationIfWrong: "Database connections use Mongoose or native drivers." },
            { id: "D", text: "It closes port 3001", explanationIfWrong: "app.listen opens the port; app.get defines routes." }
          ],
          correctAnswer: "A",
          explanationNote: "`app.get(path, handler)` sets up an endpoint handler that responds specifically to incoming HTTP GET requests at that path."
        },
        retestMcq: {
          id: "q-3.1-1-v2",
          question: "What is the role of `app.listen(PORT, callback)` in an Express server file?",
          options: [
            { id: "A", text: "It binds the application to a TCP port and begins listening for incoming network connections", explanationIfWrong: "" },
            { id: "B", text: "It listens for keyboard events typed by the user in the browser", explanationIfWrong: "app.listen binds network sockets, not browser DOM keystrokes." },
            { id: "C", text: "It compiles TypeScript into JavaScript", explanationIfWrong: "tsc compiles TypeScript." },
            { id: "D", text: "It downloads npm packages", explanationIfWrong: "npm install downloads packages." }
          ],
          correctAnswer: "A",
          explanationNote: "`app.listen()` activates the server on the specified network port, waiting to accept and dispatch incoming HTTP requests."
        }
      },
      {
        heading: "Automatic Server Restarts with `nodemon`",
        text: "By default, Node.js requires stopping and restarting the process after every code edit. The `nodemon` tool monitors files and restarts the server automatically.",
        codeSnippet: `// package.json scripts:\n"scripts": {\n  "start": "node index.js",\n  "dev": "nodemon index.js"\n}\n\n// Run in terminal: npm run dev`,
        terminalOutput: `[nodemon] starting \`node index.js\`\n[nodemon] restarting due to changes...`,
        mcq: {
          id: "q-3.1-2-v1",
          question: "Why is `nodemon` commonly installed as a development dependency in Node.js projects?",
          options: [
            { id: "A", text: "It monitors project files and automatically restarts the Node.js server whenever code changes are saved", explanationIfWrong: "" },
            { id: "B", text: "It encrypts the database passwords in production", explanationIfWrong: "nodemon is solely a developer convenience tool for restarts." },
            { id: "C", text: "It compiles React JSX files into CSS", explanationIfWrong: "nodemon does not compile JSX." },
            { id: "D", text: "It prevents users from sending HTTP DELETE requests", explanationIfWrong: "nodemon has no effect on HTTP verbs." }
          ],
          correctAnswer: "A",
          explanationNote: "`nodemon` wraps your Node application, watches source files in the directory, and restarts the process on file changes."
        },
        retestMcq: {
          id: "q-3.1-2-v2",
          question: "Why should `nodemon` be installed using `npm install --save-dev nodemon` instead of standard dependencies?",
          options: [
            { id: "A", text: "Because nodemon is only needed during local development, not in production deployment environments", explanationIfWrong: "" },
            { id: "B", text: "Because production servers forbid devDependencies", explanationIfWrong: "Production servers run `node index.js` via npm start, saving memory." },
            { id: "C", text: "Because it costs money if installed in dependencies", explanationIfWrong: "npm packages are open-source and free." },
            { id: "D", text: "Because devDependencies run twice as fast", explanationIfWrong: "devDependencies are just categorization in package.json." }
          ],
          correctAnswer: "A",
          explanationNote: "Production environments run the stable server with `node index.js`. Dev tools like nodemon are only needed by developers locally."
        }
      },
      {
        heading: "CommonJS (`require`) vs ES Modules (`import`)",
        text: "Historically, Node.js used CommonJS (`const express = require('express')`). Modern Node.js also supports ES Modules (`import express from 'express'`) by adding `\"type\": \"module\"` to package.json.",
        codeSnippet: `// CommonJS (Default in Part 3 Helsinki):\nconst express = require('express');\nmodule.exports = app;\n\n// ES Modules (Alternative with "type": "module"):\nimport express from 'express';\nexport default app;`,
        terminalOutput: `Both module systems load dependencies and expose exports`,
        mcq: {
          id: "q-3.1-3-v1",
          question: "In standard Node.js CommonJS syntax, how are external modules imported?",
          options: [
            { id: "A", text: "Using the `require()` function (e.g. `const express = require('express')`)", explanationIfWrong: "" },
            { id: "B", text: "Using `<script src='express.js'>`", explanationIfWrong: "script tags are for HTML documents in browsers." },
            { id: "C", text: "Using `include express`", explanationIfWrong: "include is C/C++ or PHP syntax." },
            { id: "D", text: "Using `fetch('express')`", explanationIfWrong: "fetch makes HTTP network requests." }
          ],
          correctAnswer: "A",
          explanationNote: "CommonJS is Node's original module system where modules are synchronously loaded using `require()` and exported via `module.exports`."
        },
        retestMcq: {
          id: "q-3.1-3-v2",
          question: "How do you export a function or object from a file in CommonJS?",
          options: [
            { id: "A", text: "Assign it to `module.exports = ...` or `exports.myFunc = ...`", explanationIfWrong: "" },
            { id: "B", text: "Write `return myFunc` at the bottom of the file", explanationIfWrong: "Files are not functions; top-level return is invalid." },
            { id: "C", text: "Call `window.export(myFunc)`", explanationIfWrong: "window does not exist in Node.js." },
            { id: "D", text: "Save the function name in package.json", explanationIfWrong: "package.json does not export file symbols." }
          ],
          correctAnswer: "A",
          explanationNote: "`module.exports` is the special object that Node.js returns when another file calls `require()` on that module."
        }
      },
      {
        heading: "Returning JSON with `response.json()`",
        text: "When building REST APIs, use `response.json(data)` to automatically serialize JavaScript objects into JSON format and set the `Content-Type: application/json` header.",
        codeSnippet: `const notes = [\n  { id: 1, content: 'HTML is easy', important: true }\n];\n\napp.get('/api/notes', (request, response) => {\n  response.json(notes);\n});`,
        terminalOutput: `HTTP/1.1 200 OK\nContent-Type: application/json\n[{"id":1,"content":"HTML is easy","important":true}]`,
        mcq: {
          id: "q-3.1-4-v1",
          question: "What two things does Express's `response.json(notes)` method do automatically?",
          options: [
            { id: "A", text: "Serializes the JavaScript object into a JSON string and sets the `Content-Type` header to `application/json`", explanationIfWrong: "" },
            { id: "B", text: "Saves the notes to a MySQL database and emails the user", explanationIfWrong: "It sends an HTTP response; it does not write to MySQL or email." },
            { id: "C", text: "Closes the TCP network connection permanently", explanationIfWrong: "It finishes the current request-response cycle." },
            { id: "D", text: "Converts the data into an XML document", explanationIfWrong: "It formats as JSON, not XML." }
          ],
          correctAnswer: "A",
          explanationNote: "`response.json()` formats the passed object using `JSON.stringify()` and assigns the appropriate HTTP response headers."
        },
        retestMcq: {
          id: "q-3.1-4-v2",
          question: "If you used `response.send(notes)` with an array, how does Express handle it?",
          options: [
            { id: "A", text: "Express recognizes that an array/object was passed and automatically formats it as JSON with the application/json header", explanationIfWrong: "" },
            { id: "B", text: "Express crashes with a TypeMismatch error", explanationIfWrong: "Express handles objects in response.send cleanly." },
            { id: "C", text: "It converts each item into an HTML <li> element", explanationIfWrong: "Express does not invent HTML tags." },
            { id: "D", text: "It sends an empty 0-byte file", explanationIfWrong: "Data is serialized." }
          ],
          correctAnswer: "A",
          explanationNote: "While `response.send()` can accept strings, buffers, or objects, explicitly using `response.json()` is the clearer best practice for REST APIs."
        }
      },
      {
        heading: "Port Environment Variables & Defaults",
        text: "In production cloud environments (like Render or Fly.io), the hosting platform assigns the port dynamically via `process.env.PORT`.",
        codeSnippet: `// Use platform-assigned port, or fallback to 3001 locally:\nconst PORT = process.env.PORT || 3001;\n\napp.listen(PORT, () => {\n  console.log(\`Server running on port \${PORT}\`);\n});`,
        terminalOutput: `Server running on port 3001 (or $PORT in cloud)`,
        mcq: {
          id: "q-3.1-5-v1",
          question: "Why should you configure the server port using `const PORT = process.env.PORT || 3001`?",
          options: [
            { id: "A", text: "Cloud hosting platforms assign dynamic ports via `process.env.PORT`, while `3001` serves as a fallback for local testing", explanationIfWrong: "" },
            { id: "B", text: "Because port 3001 is illegal on public servers", explanationIfWrong: "Port 3001 is legal, but cloud hosts assign custom ports dynamically." },
            { id: "C", text: "To encrypt the TCP connection port", explanationIfWrong: "Ports are networking endpoints, not encryption layers." },
            { id: "D", text: "To make the server run without Node.js", explanationIfWrong: "Node.js is always required." }
          ],
          correctAnswer: "A",
          explanationNote: "Cloud providers inject their assigned port into the environment. Falling back to 3001 ensures smooth local development."
        },
        retestMcq: {
          id: "q-3.1-5-v2",
          question: "Where do environment variables in Node.js reside at runtime?",
          options: [
            { id: "A", text: "In the global `process.env` object", explanationIfWrong: "" },
            { id: "B", text: "In `window.localStorage`", explanationIfWrong: "localStorage is a browser API." },
            { id: "C", text: "Inside package.json", explanationIfWrong: "package.json contains metadata and scripts, not runtime environment vars." },
            { id: "D", text: "In HTML cookies", explanationIfWrong: "Cookies are client-server HTTP headers." }
          ],
          correctAnswer: "A",
          explanationNote: "Node's built-in `process.env` object holds all environment variables passed by the operating system or hosting provider."
        }
      }
    ]
  },
  {
    id: "3-2-rest-endpoints-json-middleware",
    number: "3.2",
    title: "RESTful Endpoints & express.json() Middleware",
    subtitle: "Implement route parameters, handle HTTP GET, DELETE, and POST, parse incoming JSON request bodies, and handle 404s.",
    readTime: "14 min",
    objectives: [
      "Access route parameters using request.params (e.g. /api/notes/:id)",
      "Return appropriate HTTP status codes (200 OK, 201 Created, 204 No Content, 404 Not Found)",
      "Delete resources in memory using Array.prototype.filter()",
      "Enable JSON body parsing using the built-in express.json() middleware",
      "Extract and validate data from request.body in POST handlers",
      "Test API endpoints using REST clients (VS Code REST Client, Postman, or curl)"
    ],
    theoryBlocks: [
      {
        heading: "Route Parameters with `request.params`",
        text: "Parameters in route paths are defined with colons (e.g., `/api/notes/:id`). Access the dynamic values using `request.params.id`.",
        codeSnippet: `app.get('/api/notes/:id', (request, response) => {\n  const id = request.params.id;\n  const note = notes.find(note => note.id === id);\n\n  if (note) {\n    response.json(note);\n  } else {\n    response.status(404).end(); // Not found\n  }\n});`,
        terminalOutput: `GET /api/notes/1 -> 200 OK with note JSON | GET /api/notes/999 -> 404 Not Found`,
        mcq: {
          id: "q-3.2-0-v1",
          question: "Given the route `/api/notes/:id`, how do you access the value of `id` inside the route handler?",
          options: [
            { id: "A", text: "`request.params.id`", explanationIfWrong: "" },
            { id: "B", text: "`request.body.id`", explanationIfWrong: "request.body contains the payload of POST/PUT requests." },
            { id: "C", text: "`request.query.id`", explanationIfWrong: "request.query is for URL query strings like ?id=1." },
            { id: "D", text: "`response.params.id`", explanationIfWrong: "params belong to the incoming request, not the outgoing response." }
          ],
          correctAnswer: "A",
          explanationNote: "Express captures dynamic URL path segments defined with colons into the `request.params` object."
        },
        retestMcq: {
          id: "q-3.2-0-v2",
          question: "What is the data type of `request.params.id` in Express?",
          options: [
            { id: "A", text: "Always a `string`, regardless of whether the URL contained digits", explanationIfWrong: "" },
            { id: "B", text: "Always a `number`", explanationIfWrong: "URL segments are parsed as text strings." },
            { id: "C", text: "A boolean", explanationIfWrong: "URL segments are strings." },
            { id: "D", text: "An array of bytes", explanationIfWrong: "Express parses route params as strings." }
          ],
          correctAnswer: "A",
          explanationNote: "Because URLs are text strings, route parameters are always strings. If comparing against numeric IDs, cast with `Number(id)`."
        }
      },
      {
        heading: "Handling 404 Not Found Responses",
        text: "When a requested resource ID does not exist in the collection, respond with HTTP status code 404 Not Found using `response.status(404).end()`.",
        codeSnippet: `const note = notes.find(n => n.id === id);\nif (!note) {\n  return response.status(404).json({ error: 'Note not found' });\n}\nresponse.json(note);`,
        terminalOutput: `HTTP/1.1 404 Not Found\n{"error":"Note not found"}`,
        mcq: {
          id: "q-3.2-1-v1",
          question: "Why should a server return HTTP 404 when a client requests `/api/notes/99999` and no such note exists?",
          options: [
            { id: "A", text: "404 Not Found is the official HTTP standard code indicating the requested resource does not exist", explanationIfWrong: "" },
            { id: "B", text: "Because returning 200 with an empty object crashes the internet", explanationIfWrong: "It won't crash the internet, but it violates REST principles." },
            { id: "C", text: "To reboot the client's router", explanationIfWrong: "HTTP status codes do not reboot routers." },
            { id: "D", text: "To force the user to log in again", explanationIfWrong: "401/403 handles authentication, not 404." }
          ],
          correctAnswer: "A",
          explanationNote: "RESTful APIs use HTTP status codes to communicate outcome semantics. 404 accurately tells clients that the requested item is absent."
        },
        retestMcq: {
          id: "q-3.2-1-v2",
          question: "What does `response.status(404).end()` do?",
          options: [
            { id: "A", text: "Sets the HTTP response status to 404 and ends the response without sending any body content", explanationIfWrong: "" },
            { id: "B", text: "Shuts down the Node.js server process", explanationIfWrong: "It completes the HTTP response, leaving the server running." },
            { id: "C", text: "Deletes the 404 file from disk", explanationIfWrong: "No file operations occur." },
            { id: "D", text: "Redirects the user to Google", explanationIfWrong: "Redirections use 301/302 status codes." }
          ],
          correctAnswer: "A",
          explanationNote: "`.status(404)` assigns the status code, and `.end()` immediately terminates the response stream without sending body data."
        }
      },
      {
        heading: "Deleting Resources with HTTP DELETE",
        text: "Deleting a resource removes it from the dataset and responds with HTTP status 204 No Content to indicate success without returning a body.",
        codeSnippet: `app.delete('/api/notes/:id', (request, response) => {\n  const id = request.params.id;\n  notes = notes.filter(note => note.id !== id);\n\n  response.status(204).end(); // Success, no content to return\n});`,
        terminalOutput: `DELETE /api/notes/2 -> 204 No Content`,
        mcq: {
          id: "q-3.2-2-v1",
          question: "Which HTTP status code is standard when a resource is successfully deleted and no data body is returned?",
          options: [
            { id: "A", text: "204 No Content", explanationIfWrong: "" },
            { id: "B", text: "200 OK", explanationIfWrong: "200 is acceptable, but 204 is the standard when no response body is returned." },
            { id: "C", text: "500 Internal Server Error", explanationIfWrong: "500 signifies a server crash, not success." },
            { id: "D", text: "304 Not Modified", explanationIfWrong: "304 is for browser caching." }
          ],
          correctAnswer: "A",
          explanationNote: "HTTP 204 No Content signifies that the request succeeded and the server has no content to send back in the response payload."
        },
        retestMcq: {
          id: "q-3.2-2-v2",
          question: "If a DELETE request is sent for an ID that was already deleted, what is the RESTful convention?",
          options: [
            { id: "A", text: "Return 204 No Content (idempotent deletion) or 404 Not Found", explanationIfWrong: "" },
            { id: "B", text: "Throw an unhandled JavaScript exception", explanationIfWrong: "Exceptions should never be left unhandled." },
            { id: "C", text: "Delete all other resources in the database", explanationIfWrong: "Deletions must be targeted strictly to the specified ID." },
            { id: "D", text: "Return HTTP 500", explanationIfWrong: "A missing resource is not a server crash." }
          ],
          correctAnswer: "A",
          explanationNote: "DELETE is often designed to be idempotent: whether the resource was deleted just now or earlier, the end result is the same (204 or 404)."
        }
      },
      {
        heading: "The `express.json()` Middleware",
        text: "Without the `express.json()` middleware, incoming POST request bodies cannot be read and will be `undefined`. Always call `app.use(express.json())`.",
        codeSnippet: `const express = require('express');\nconst app = express();\n\n// Crucial: Parses incoming JSON payloads into request.body\napp.use(express.json());\n\napp.post('/api/notes', (request, response) => {\n  console.log(request.body); // Contains the parsed JSON object!\n});`,
        terminalOutput: `Console: { content: 'Postman test', important: true }`,
        mcq: {
          id: "q-3.2-3-v1",
          question: "Why will `request.body` be `undefined` in a POST handler if you forget `app.use(express.json())`?",
          options: [
            { id: "A", text: "Express does not parse raw incoming JSON streams by default; `express.json()` parses the stream into a JavaScript object", explanationIfWrong: "" },
            { id: "B", text: "HTTP requests cannot contain bodies without cookies", explanationIfWrong: "Bodies are independent of cookies." },
            { id: "C", text: "Because Node.js only understands XML", explanationIfWrong: "Node.js handles all text and binary formats." },
            { id: "D", text: "Because the computer ran out of memory", explanationIfWrong: "It is a middleware pipeline configuration requirement." }
          ],
          correctAnswer: "A",
          explanationNote: "Express leaves `request.body` undefined until a body-parsing middleware like `express.json()` reads and parses the incoming stream."
        },
        retestMcq: {
          id: "q-3.2-3-v2",
          question: "Where in your code should `app.use(express.json())` be called relative to route definitions?",
          options: [
            { id: "A", text: "Near the top of the file, before any route handlers that need to access `request.body`", explanationIfWrong: "" },
            { id: "B", text: "At the very bottom after `app.listen()`", explanationIfWrong: "Code after app.listen is too late for registered routes." },
            { id: "C", text: "Inside package.json", explanationIfWrong: "package.json does not execute middleware." },
            { id: "D", text: "Inside the database schema file", explanationIfWrong: "Middleware is registered on the Express app." }
          ],
          correctAnswer: "A",
          explanationNote: "Express executes middleware in sequential order. `express.json()` must be registered before the routes that consume `request.body`."
        }
      },
      {
        heading: "Handling HTTP POST & Generating IDs",
        text: "In POST handlers, extract data from `request.body`, validate required fields, assign a unique ID, and return HTTP 201 Created with the saved object.",
        codeSnippet: `app.post('/api/notes', (request, response) => {\n  const body = request.body;\n\n  if (!body.content) {\n    return response.status(400).json({ error: 'content missing' });\n  }\n\n  const note = {\n    id: String(Date.now()), // Unique ID generation\n    content: body.content,\n    important: Boolean(body.important) || false\n  };\n\n  notes = notes.concat(note);\n  response.status(201).json(note); // 201 Created\n});`,
        terminalOutput: `POST /api/notes 201 Created -> Returns saved note with generated ID`,
        mcq: {
          id: "q-3.2-4-v1",
          question: "What HTTP status code should be returned if a client sends a POST request with missing required data (e.g. no content)?",
          options: [
            { id: "A", text: "400 Bad Request", explanationIfWrong: "" },
            { id: "B", text: "200 OK", explanationIfWrong: "200 implies successful processing." },
            { id: "C", text: "500 Internal Server Error", explanationIfWrong: "500 is for server bugs, not invalid client input." },
            { id: "D", text: "404 Not Found", explanationIfWrong: "404 is for missing endpoints, not malformed payloads." }
          ],
          correctAnswer: "A",
          explanationNote: "HTTP status 400 Bad Request informs the client that their request syntax or payload was malformed or missing required fields."
        },
        retestMcq: {
          id: "q-3.2-4-v2",
          question: "Why should you write `return response.status(400).json(...)` when rejecting an invalid request?",
          options: [
            { id: "A", text: "The `return` stops the function from continuing execution and trying to save the invalid note", explanationIfWrong: "" },
            { id: "B", text: "Express requires every function to return a boolean", explanationIfWrong: "Express ignores return values from route callbacks." },
            { id: "C", text: "It restarts the nodemon process", explanationIfWrong: "It does not restart nodemon." },
            { id: "D", text: "It clears the request headers", explanationIfWrong: "Headers are not cleared." }
          ],
          correctAnswer: "A",
          explanationNote: "Calling `return` halts function execution immediately, preventing code further down from attempting to save an invalid resource."
        }
      },
      {
        heading: "Testing APIs: VS Code REST Client & Postman",
        text: "You can test backend routes before frontend integration using tools like the VS Code REST Client extension (`.rest` files) or Postman.",
        codeSnippet: `// requests/create_note.rest:\nPOST http://localhost:3001/api/notes\nContent-Type: application/json\n\n{\n  "content": "VS Code REST Client is awesome",\n  "important": true\n}`,
        terminalOutput: `HTTP/1.1 201 Created\nContent-Type: application/json\n{\n  "id": "1728812345",\n  "content": "VS Code REST Client is awesome",\n  "important": true\n}`,
        mcq: {
          id: "q-3.2-5-v1",
          question: "What header MUST be included in an HTTP POST request so Express's `express.json()` knows to parse the body?",
          options: [
            { id: "A", text: "`Content-Type: application/json`", explanationIfWrong: "" },
            { id: "B", text: "`Accept: text/html`", explanationIfWrong: "Accept specifies what the client wants to receive, not what it's sending." },
            { id: "C", text: "`User-Agent: Mozilla`", explanationIfWrong: "User-Agent identifies the client software." },
            { id: "D", text: "`Host: localhost`", explanationIfWrong: "Host identifies the server domain." }
          ],
          correctAnswer: "A",
          explanationNote: "The `Content-Type: application/json` header informs the server that the request body payload is formatted as JSON."
        },
        retestMcq: {
          id: "q-3.2-5-v2",
          question: "What is the advantage of using a `.rest` file in VS Code compared to a browser address bar when testing APIs?",
          options: [
            { id: "A", text: "Browsers only send GET requests from the address bar, whereas `.rest` files can send POST, PUT, and DELETE requests with custom JSON bodies", explanationIfWrong: "" },
            { id: "B", text: "`.rest` files execute on remote supercomputers", explanationIfWrong: "They execute locally in VS Code." },
            { id: "C", text: "Browsers cannot connect to port 3001", explanationIfWrong: "Browsers connect to any port." },
            { id: "D", text: "`.rest` files bypass all authentication rules", explanationIfWrong: "Auth tokens must be supplied in headers." }
          ],
          correctAnswer: "A",
          explanationNote: "Typing a URL into a browser address bar can only perform an HTTP GET. REST test files allow testing full CRUD operations."
        }
      }
    ]
  },
  {
    id: "3-3-middleware-architecture-logging",
    number: "3.3",
    title: "Middleware Architecture & Custom Logging",
    subtitle: "Understand Express middleware execution order, the (req, res, next) signature, third-party loggers like Morgan, and catch-all 404 handlers.",
    readTime: "14 min",
    objectives: [
      "Understand what middleware functions are in Express",
      "Master the middleware signature: (request, response, next)",
      "Explain the critical role of calling next() to pass control",
      "Configure the Morgan HTTP logging middleware for request debugging",
      "Implement custom middleware functions for request logging and header tracking",
      "Define catch-all unknown endpoint middleware after all routes"
    ],
    theoryBlocks: [
      {
        heading: "What is Middleware in Express?",
        text: "Middleware functions are functions that have access to the request (`req`), response (`res`), and the `next` function in the application's request-response cycle.",
        codeSnippet: `const requestLogger = (request, response, next) => {\n  console.log('Method:', request.method);\n  console.log('Path:  ', request.path);\n  console.log('Body:  ', request.body);\n  console.log('---');\n  next(); // Pass control to the next middleware in chain!\n};\n\napp.use(requestLogger);`,
        terminalOutput: `Method: POST\nPath:   /api/notes\nBody:   { content: 'test' }\n---`,
        mcq: {
          id: "q-3.3-0-v1",
          question: "What are the three parameters passed to a standard Express middleware function?",
          options: [
            { id: "A", text: "`request`, `response`, and `next`", explanationIfWrong: "" },
            { id: "B", text: "`input`, `output`, and `error`", explanationIfWrong: "The standard parameters are req, res, next." },
            { id: "C", text: "`database`, `table`, and `row`", explanationIfWrong: "Middleware is part of HTTP handling, not database queries." },
            { id: "D", text: "`html`, `css`, and `js`", explanationIfWrong: "Middleware parameters are request, response, next." }
          ],
          correctAnswer: "A",
          explanationNote: "Express middleware receives `(request, response, next)`, allowing inspection/modification of the request or response before delegating to `next()`."
        },
        retestMcq: {
          id: "q-3.3-0-v2",
          question: "What happens if a middleware function neither sends a response nor calls `next()`?",
          options: [
            { id: "A", text: "The request hangs indefinitely until the client times out", explanationIfWrong: "" },
            { id: "B", text: "Express automatically assumes the request succeeded", explanationIfWrong: "Express cannot proceed without next() or response.send()." },
            { id: "C", text: "The server restarts automatically", explanationIfWrong: "The server remains running, but the client connection hangs." },
            { id: "D", text: "A 404 Not Found error is returned immediately", explanationIfWrong: "It hangs waiting for a signal." }
          ],
          correctAnswer: "A",
          explanationNote: "If `next()` is not called and no response is returned, Express halts the pipeline and the client connection hangs."
        }
      },
      {
        heading: "The Role of `next()` in the Middleware Chain",
        text: "Calling `next()` yields control to the next middleware function in line. Middleware functions are executed sequentially in the order they are loaded with `app.use()`.",
        codeSnippet: `app.use(express.json());       // 1. Parses JSON\napp.use(requestLogger);      // 2. Logs request\n// ... route handlers ...    // 3. Processes endpoint\napp.use(unknownEndpoint);    // 4. Catches unhandled routes`,
        terminalOutput: `Sequential execution pipeline: 1 -> 2 -> 3 -> 4`,
        mcq: {
          id: "q-3.3-1-v1",
          question: "In what order does Express execute registered middleware functions?",
          options: [
            { id: "A", text: "Sequentially in the exact order they are defined with `app.use()` in the code", explanationIfWrong: "" },
            { id: "B", text: "In random order determined by the CPU scheduler", explanationIfWrong: "Middleware execution is strictly deterministic and ordered." },
            { id: "C", text: "Alphabetically by function name", explanationIfWrong: "Order in the source code dictates execution." },
            { id: "D", text: "In reverse order from bottom to top", explanationIfWrong: "Execution runs top to bottom." }
          ],
          correctAnswer: "A",
          explanationNote: "Express executes middleware in top-to-bottom order. The sequence of `app.use()` calls determines the processing pipeline."
        },
        retestMcq: {
          id: "q-3.3-1-v2",
          question: "What happens if you define `app.use(unknownEndpoint)` BEFORE your route handlers (e.g. `app.get('/api/notes', ...)` )?",
          options: [
            { id: "A", text: "Every request will be intercepted by `unknownEndpoint`, returning 404 for all valid routes", explanationIfWrong: "" },
            { id: "B", text: "Routes work normally because Express prioritizes routes over middleware", explanationIfWrong: "Express treats routes and middleware identically in sequential order." },
            { id: "C", text: "Node.js throws a syntax error on startup", explanationIfWrong: "Syntax is valid, but runtime routing logic is broken." },
            { id: "D", text: "UnknownEndpoint only runs on Sundays", explanationIfWrong: "Middleware executes on every incoming request." }
          ],
          correctAnswer: "A",
          explanationNote: "Because middleware runs sequentially, putting a catch-all 404 handler first prevents any subsequent routes from ever being reached."
        }
      },
      {
        heading: "HTTP Request Logging with `morgan`",
        text: "The popular third-party `morgan` middleware logs HTTP request methods, paths, status codes, and execution times automatically to the terminal.",
        codeSnippet: `const morgan = require('morgan');\n\n// Predefined logging format:\napp.use(morgan('tiny'));`,
        terminalOutput: `GET /api/notes 200 482 - 3.421 ms\nPOST /api/notes 201 128 - 7.182 ms`,
        mcq: {
          id: "q-3.3-2-v1",
          question: "What is `morgan` in an Express application?",
          options: [
            { id: "A", text: "An HTTP request logger middleware that outputs formatted network activity to the console", explanationIfWrong: "" },
            { id: "B", text: "A database encryption driver", explanationIfWrong: "morgan is strictly an HTTP logger." },
            { id: "C", text: "A frontend CSS UI component library", explanationIfWrong: "morgan is a backend Node.js middleware." },
            { id: "D", text: "A compiler for React JSX", explanationIfWrong: "morgan logs HTTP requests." }
          ],
          correctAnswer: "A",
          explanationNote: "`morgan` automatically tracks incoming HTTP requests and logs useful debugging metrics (method, URL, status code, response time) to stdout."
        },
        retestMcq: {
          id: "q-3.3-2-v2",
          question: "How can you log the POST request body data in Morgan for debugging (as required in Helsinki Part 3 exercises)?",
          options: [
            { id: "A", text: "Define a custom Morgan token using `morgan.token('body', req => JSON.stringify(req.body))`", explanationIfWrong: "" },
            { id: "B", text: "Pass `--show-body` to npm start", explanationIfWrong: "npm start does not configure Morgan tokens." },
            { id: "C", text: "Morgan cannot log bodies under any circumstances", explanationIfWrong: "Morgan supports custom tokens." },
            { id: "D", text: "Write the body to index.html", explanationIfWrong: "Morgan logs to the server terminal." }
          ],
          correctAnswer: "A",
          explanationNote: "Morgan allows custom tokens (`morgan.token('body', ...)`), enabling developers to include serialized request payloads in terminal logs."
        }
      },
      {
        heading: "Catch-All Unknown Endpoint Middleware",
        text: "A catch-all middleware placed at the very end of the file catches any requests that did not match any defined routes and returns a clean 404 response.",
        codeSnippet: `// Place AFTER all valid routes:\nconst unknownEndpoint = (request, response) => {\n  response.status(404).send({ error: 'unknown endpoint' });\n};\n\napp.use(unknownEndpoint);`,
        terminalOutput: `GET /invalid-path -> 404 { error: 'unknown endpoint' }`,
        mcq: {
          id: "q-3.3-3-v1",
          question: "Why does the `unknownEndpoint` middleware only handle unmatched requests when placed at the end of the file?",
          options: [
            { id: "A", text: "Because if a request matches an earlier route handler, that route sends a response, terminating the cycle before reaching the end", explanationIfWrong: "" },
            { id: "B", text: "Because Express sorts middleware by string length", explanationIfWrong: "Express preserves sequential source code order." },
            { id: "C", text: "Because the operating system blocks earlier 404 handlers", explanationIfWrong: "Express handles routing, not the OS." },
            { id: "D", text: "Because unknownEndpoint is executed asynchronously tomorrow", explanationIfWrong: "Middleware executes in the current event loop pass." }
          ],
          correctAnswer: "A",
          explanationNote: "Route handlers that send a response end the HTTP cycle. Only requests that match no routes reach the bottom middleware."
        },
        retestMcq: {
          id: "q-3.3-3-v2",
          question: "Does `unknownEndpoint` need to accept or call `next` if it terminates the response with `.send()`?",
          options: [
            { id: "A", text: "No, because sending a response completes the HTTP cycle; calling `next` is unnecessary when terminating", explanationIfWrong: "" },
            { id: "B", text: "Yes, failing to call next throws an unrecoverable exception", explanationIfWrong: "Sending a response concludes the request cleanly." },
            { id: "C", text: "Only on Windows operating systems", explanationIfWrong: "Express operates identically on Windows, Linux, and macOS." },
            { id: "D", text: "Only when using MongoDB", explanationIfWrong: "Database choice has no impact on HTTP termination." }
          ],
          correctAnswer: "A",
          explanationNote: "When a middleware finishes by sending a response (`response.status(404).send(...)`), the cycle is complete, so `next()` is not called."
        }
      },
      {
        heading: "Modifying Request Objects in Middleware",
        text: "Middleware can attach new properties to the `request` object (such as `request.requestTime = new Date()`), making them available to all downstream route handlers.",
        codeSnippet: `const requestTimeLogger = (request, response, next) => {\n  request.receivedAt = new Date();\n  next();\n};\n\napp.use(requestTimeLogger);\n\napp.get('/info', (request, response) => {\n  response.send(\`<p>Request received at \${request.receivedAt}</p>\`);\n});`,
        terminalOutput: `Dynamic data attached in middleware is accessible in all subsequent routes`,
        mcq: {
          id: "q-3.3-4-v1",
          question: "How can middleware share data (such as an authenticated user or request timestamp) with downstream route handlers?",
          options: [
            { id: "A", text: "By attaching properties directly to the `request` object (e.g. `request.user = decodedToken`)", explanationIfWrong: "" },
            { id: "B", text: "By saving it to a global variable accessible across all users", explanationIfWrong: "Global variables cause critical race conditions between different concurrent users." },
            { id: "C", text: "By appending it to package.json", explanationIfWrong: "package.json is a static configuration file." },
            { id: "D", text: "By printing it with console.log", explanationIfWrong: "Logging outputs text; it does not pass data to handlers." }
          ],
          correctAnswer: "A",
          explanationNote: "The `request` object is unique to each HTTP request. Attaching properties to `request` is the standard way to pass request-scoped data down the pipeline."
        },
        retestMcq: {
          id: "q-3.3-4-v2",
          question: "Why are global variables dangerous for storing request data in Node.js?",
          options: [
            { id: "A", text: "Node.js is a single process serving many users concurrently; global variables would be overwritten and shared across different users' requests", explanationIfWrong: "" },
            { id: "B", text: "Global variables cause the hard drive to format", explanationIfWrong: "No hard drive corruption occurs." },
            { id: "C", text: "Node.js disallows global variables with syntax errors", explanationIfWrong: "JavaScript allows globals, but they create concurrency bugs." },
            { id: "D", text: "Global variables can only store numbers", explanationIfWrong: "Variables can store any data type." }
          ],
          correctAnswer: "A",
          explanationNote: "In Node's single-threaded event loop, all requests share the same global scope. Request-specific data must stay on the `request` object."
        }
      },
      {
        heading: "Error Handling Middleware Signature (`err, req, res, next`)",
        text: "Error-handling middleware is identified by having exactly FOUR parameters: `(error, request, response, next)`. Express only passes errors to 4-parameter middleware.",
        codeSnippet: `const errorHandler = (error, request, response, next) => {\n  console.error(error.message);\n  if (error.name === 'CastError') {\n    return response.status(400).send({ error: 'malformatted id' });\n  }\n  next(error); // Pass to default Express error handler\n};\n\napp.use(errorHandler);`,
        terminalOutput: `Catches unhandled exceptions and formats clean JSON error responses`,
        mcq: {
          id: "q-3.3-5-v1",
          question: "How does Express differentiate an error-handling middleware from a regular middleware?",
          options: [
            { id: "A", text: "An error-handling middleware function takes exactly FOUR arguments: `(error, request, response, next)`", explanationIfWrong: "" },
            { id: "B", text: "By the file extension (.error.js)", explanationIfWrong: "Express inspects function arity (fn.length === 4)." },
            { id: "C", text: "By checking if the function name begins with 'error'", explanationIfWrong: "Function names are arbitrary." },
            { id: "D", text: "Using a TypeScript interface only", explanationIfWrong: "This is a core runtime Express JavaScript mechanism." }
          ],
          correctAnswer: "A",
          explanationNote: "Express inspects `fn.length`. If a middleware declares 4 parameters, Express routes errors passed to `next(error)` directly to it."
        },
        retestMcq: {
          id: "q-3.3-5-v2",
          question: "How do you forward an error from a route handler to the centralized error-handling middleware?",
          options: [
            { id: "A", text: "Call `next(error)` with the error object as an argument", explanationIfWrong: "" },
            { id: "B", text: "Call `response.error()`", explanationIfWrong: "response.error is not an Express method." },
            { id: "C", text: "Write `console.error(error)` only", explanationIfWrong: "Logging does not pass control to error handlers." },
            { id: "D", text: "Restart the computer", explanationIfWrong: "Error handlers catch errors in software." }
          ],
          correctAnswer: "A",
          explanationNote: "Passing any argument to `next(arg)` signals Express that an error occurred, skipping all regular routes and jumping to the next error middleware."
        }
      }
    ]
  },
  {
    id: "3-4-cors-static-frontend-hosting",
    number: "3.4",
    title: "Same-Origin Policy, CORS & Static Frontend",
    subtitle: "Resolve Cross-Origin Resource Sharing (CORS) restrictions, serve production React builds via Express, and streamline full-stack deployment.",
    readTime: "14 min",
    objectives: [
      "Understand the browser's Same-Origin Policy security model",
      "Resolve cross-origin blocks using the Express `cors` middleware",
      "Build a production-ready React frontend bundle using `npm run build`",
      "Serve static frontend files from Express using `express.static('dist')`",
      "Understand how single-origin full-stack deployments eliminate CORS issues",
      "Configure automated build and deployment scripts in package.json"
    ],
    theoryBlocks: [
      {
        heading: "The Same-Origin Policy",
        text: "The Same-Origin Policy is a fundamental browser security mechanism that blocks scripts on one origin (e.g. `localhost:5173`) from reading resources on another origin (e.g. `localhost:3001`).",
        codeSnippet: `// Origin = Protocol (http) + Domain (localhost) + Port (5173)\nhttp://localhost:5173  -> Frontend\nhttp://localhost:3001  -> Backend (Different port = Different origin!)`,
        terminalOutput: `Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource`,
        mcq: {
          id: "q-3.4-0-v1",
          question: "What three components define a web 'origin' under the Same-Origin Policy?",
          options: [
            { id: "A", text: "Protocol (http/https), Domain hostname (localhost/example.com), and Port (e.g. 5173 vs 3001)", explanationIfWrong: "" },
            { id: "B", text: "Username, Password, and Email", explanationIfWrong: "Origin is a networking concept, not user credentials." },
            { id: "C", text: "HTML, CSS, and JavaScript", explanationIfWrong: "These are file types." },
            { id: "D", text: "Browser version, Operating System, and IP address", explanationIfWrong: "Origin is defined strictly by protocol + host + port." }
          ],
          correctAnswer: "A",
          explanationNote: "Two URLs share the same origin only if their protocol, host domain, and port number match exactly."
        },
        retestMcq: {
          id: "q-3.4-0-v2",
          question: "Do `http://localhost:5173` and `http://localhost:3001` have the same origin?",
          options: [
            { id: "A", text: "No, because their port numbers (5173 vs 3001) are different", explanationIfWrong: "" },
            { id: "B", text: "Yes, because both use localhost and HTTP", explanationIfWrong: "A different port constitutes a different origin." },
            { id: "C", text: "Yes, because both run on the same computer", explanationIfWrong: "The browser treats different ports as distinct origins." },
            { id: "D", text: "Only if using Google Chrome", explanationIfWrong: "Same-origin policy is a universal standard across all browsers." }
          ],
          correctAnswer: "A",
          explanationNote: "Even on the same machine, different ports constitute different origins, triggering browser cross-origin security restrictions."
        }
      },
      {
        heading: "Enabling Cross-Origin Requests with `cors`",
        text: "The `cors` middleware tells the browser via HTTP response headers (`Access-Control-Allow-Origin: *`) that requests from other origins are permitted.",
        codeSnippet: `const cors = require('cors');\n\n// Enable CORS for all incoming requests:\napp.use(cors());`,
        terminalOutput: `Response header added: Access-Control-Allow-Origin: *\nBrowser allows React app on 5173 to fetch from backend on 3001`,
        mcq: {
          id: "q-3.4-1-v1",
          question: "What does installing and using `app.use(cors())` do in an Express server?",
          options: [
            { id: "A", text: "It appends `Access-Control-Allow-Origin` headers to responses, allowing browsers on different origins to access the API", explanationIfWrong: "" },
            { id: "B", text: "It compresses all images in the frontend", explanationIfWrong: "CORS is for cross-origin permissions, not image compression." },
            { id: "C", text: "It converts MySQL queries to MongoDB", explanationIfWrong: "CORS has no connection to database queries." },
            { id: "D", text: "It slows down malicious hackers", explanationIfWrong: "CORS is a browser security policy mechanism." }
          ],
          correctAnswer: "A",
          explanationNote: "CORS (Cross-Origin Resource Sharing) headers instruct the browser that the API permits requests originating from other domains."
        },
        retestMcq: {
          id: "q-3.4-1-v2",
          question: "Where is the Same-Origin Policy enforced: by the backend server or the client's browser?",
          options: [
            { id: "A", text: "By the client's browser; the server actually processes the request, but the browser blocks JavaScript from reading the response", explanationIfWrong: "" },
            { id: "B", text: "By the backend Node.js server exclusively", explanationIfWrong: "The server receives and executes the request; the browser blocks reading." },
            { id: "C", text: "By the physical internet router", explanationIfWrong: "Routers forward packets; browsers enforce SOP." },
            { id: "D", text: "By the operating system keyboard driver", explanationIfWrong: "It is an application-layer browser security standard." }
          ],
          correctAnswer: "A",
          explanationNote: "SOP is enforced by the client browser. Tools like `curl` or Postman bypass SOP because they are not web browsers."
        }
      },
      {
        heading: "Serving Static Frontend Files with `express.static`",
        text: "You can configure Express to serve the compiled frontend production bundle (HTML, CSS, JS) from the `dist` directory.",
        codeSnippet: `// Serve static build files:\napp.use(express.static('dist'));\n\n// Now visiting http://localhost:3001 loads index.html from /dist!`,
        terminalOutput: `GET / -> Serves dist/index.html\nGET /assets/index.js -> Serves compiled React JS bundle`,
        mcq: {
          id: "q-3.4-2-v1",
          question: "What does `app.use(express.static('dist'))` instruct the Express server to do?",
          options: [
            { id: "A", text: "Check the `dist` folder for matching static files (HTML, CSS, JS) before checking API routes", explanationIfWrong: "" },
            { id: "B", text: "Delete the dist directory after 10 minutes", explanationIfWrong: "express.static serves files; it doesn't delete them." },
            { id: "C", text: "Compile React JSX on the fly", explanationIfWrong: "Static middleware serves already-compiled assets." },
            { id: "D", text: "Create a zip archive of the project", explanationIfWrong: "It hosts files over HTTP." }
          ],
          correctAnswer: "A",
          explanationNote: "`express.static` checks if a requested path corresponds to a static file in the specified directory and serves it directly."
        },
        retestMcq: {
          id: "q-3.4-2-v2",
          question: "When Express serves both the static frontend (`dist`) and the API (`/api/notes`), why is CORS no longer needed in production?",
          options: [
            { id: "A", text: "Because both the frontend HTML and the API are served from the exact same origin (domain and port)", explanationIfWrong: "" },
            { id: "B", text: "Because production servers disable all security policies", explanationIfWrong: "Security policies remain active in production." },
            { id: "C", text: "Because React deletes the CORS header in production", explanationIfWrong: "React does not manage HTTP headers." },
            { id: "D", text: "Because HTTPS encrypts the port number", explanationIfWrong: "Origin equality is what satisfies SOP." }
          ],
          correctAnswer: "A",
          explanationNote: "When frontend and API share the exact same origin, requests are 'same-origin', eliminating cross-origin security restrictions completely."
        }
      },
      {
        heading: "Building the React Production Bundle (`npm run build`)",
        text: "In development, Vite serves unbundled source files. In production, `npm run build` bundles, minifies, and optimizes your code into the static `dist` folder.",
        codeSnippet: `// In frontend folder:\nnpm run build\n\n// Output:\ndist/index.html          1.5 kB\ndist/assets/index.js   145.2 kB (minified & tree-shaken)\ndist/assets/index.css   18.4 kB`,
        terminalOutput: `✓ built in 1.4s -> production-ready static assets in /dist`,
        mcq: {
          id: "q-3.4-3-v1",
          question: "What does the `npm run build` command produce in a modern React application?",
          options: [
            { id: "A", text: "A minified, optimized, production-ready directory of static HTML, CSS, and JavaScript files", explanationIfWrong: "" },
            { id: "B", text: "A native Windows .exe executable", explanationIfWrong: "Web bundlers output web assets (HTML/CSS/JS), not desktop executables." },
            { id: "C", text: "A live database cluster in the cloud", explanationIfWrong: "Building creates client assets." },
            { id: "D", text: "A backup copy of node_modules", explanationIfWrong: "Bundlers exclude node_modules from deployment." }
          ],
          correctAnswer: "A",
          explanationNote: "`npm run build` transforms, transpiles, minifies, and bundles your entire React application into lightweight static production assets."
        },
        retestMcq: {
          id: "q-3.4-3-v2",
          question: "Why should you never run the local Vite development server (`npm run dev`) in production on a public cloud host?",
          options: [
            { id: "A", text: "Dev servers include heavy development tooling, lack optimization and minification, and are not secured for production loads", explanationIfWrong: "" },
            { id: "B", text: "Because Vite dev servers only work when connected to the developer's home WiFi", explanationIfWrong: "Vite binds to IP, but it is not optimized for production traffic." },
            { id: "C", text: "Because Vite dev servers delete database records", explanationIfWrong: "Vite is an asset bundler." },
            { id: "D", text: "Because browsers reject development ports", explanationIfWrong: "Performance, security, and bundling efficiency are the primary reasons." }
          ],
          correctAnswer: "A",
          explanationNote: "Dev servers emphasize fast Hot Module Replacement (HMR) for development. Production requires optimized, minified static files served by Express or a CDN."
        }
      },
      {
        heading: "Automating Full-Stack Deployment Scripts",
        text: "You can write npm scripts in the backend `package.json` to build the frontend, copy the `dist` folder into the backend, and start the unified server.",
        codeSnippet: `// backend/package.json:\n"scripts": {\n  "build:ui": "rm -rf dist && cd ../frontend && npm run build && cp -r dist ../backend",\n  "deploy:full": "npm run build:ui && git push"\n}`,
        terminalOutput: `Single-command automated pipeline builds frontend and deploys full stack`,
        mcq: {
          id: "q-3.4-4-v1",
          question: "What is the benefit of defining composite npm scripts like `npm run build:ui` in `package.json`?",
          options: [
            { id: "A", text: "It automates repetitive multi-step build and copy workflows into a single reproducible command", explanationIfWrong: "" },
            { id: "B", text: "It bypasses the need for JavaScript syntax parsing", explanationIfWrong: "Scripts run standard shell commands." },
            { id: "C", text: "It increases server bandwidth by 10x", explanationIfWrong: "Scripts automate tasks, not hardware bandwidth." },
            { id: "D", text: "It prevents Git merge conflicts", explanationIfWrong: "Merge conflicts depend on code edits." }
          ],
          correctAnswer: "A",
          explanationNote: "npm scripts standardize build automation, ensuring that deployment processes can be run consistently by any developer or CI/CD pipeline."
        },
        retestMcq: {
          id: "q-3.4-4-v2",
          question: "Which npm command installs dependencies in production without modifying `package-lock.json`?",
          options: [
            { id: "A", text: "`npm ci`", explanationIfWrong: "" },
            { id: "B", text: "`npm update --force`", explanationIfWrong: "npm update changes dependency versions." },
            { id: "C", text: "`npm delete-all`", explanationIfWrong: "Invalid npm command." },
            { id: "D", text: "`npm clear`", explanationIfWrong: "Invalid npm command." }
          ],
          correctAnswer: "A",
          explanationNote: "`npm ci` (Clean Install) installs exact dependencies strictly matching `package-lock.json`, making it ideal for automated builds and CI/CD."
        }
      },
      {
        heading: "Production Cloud Hosting (Render / Fly.io)",
        text: "Full-stack apps with Node.js and static frontends can be hosted on modern platforms like Render or Fly.io by specifying `npm start` as the start command.",
        codeSnippet: `// Render / Fly.io configuration:\nBuild Command: npm install\nStart Command: npm start\nEnvironment: PORT (assigned automatically)`,
        terminalOutput: `==> Your service is live at https://fullstack-notes.onrender.com`,
        mcq: {
          id: "q-3.4-5-v1",
          question: "What command does a cloud hosting platform (like Render or Fly.io) execute to launch your Node.js application in production?",
          options: [
            { id: "A", text: "`npm start` (which executes `node index.js`)", explanationIfWrong: "" },
            { id: "B", text: "`npm test`", explanationIfWrong: "npm test runs test suites, not production servers." },
            { id: "C", text: "`npm run dev`", explanationIfWrong: "dev scripts are for local development with nodemon." },
            { id: "D", text: "`node --format-all`", explanationIfWrong: "Invalid command." }
          ],
          correctAnswer: "A",
          explanationNote: "Production environments default to running `npm start`, which should execute `node index.js` without development overhead."
        },
        retestMcq: {
          id: "q-3.4-5-v2",
          question: "Why should sensitive credentials like database connection strings NEVER be hardcoded into git repositories?",
          options: [
            { id: "A", text: "Public or shared repositories expose database passwords to the internet; credentials should always be stored in environment variables", explanationIfWrong: "" },
            { id: "B", text: "Git rejects commits containing the word 'password'", explanationIfWrong: "Git stores plain text without inspecting content semantics." },
            { id: "C", text: "Hardcoded strings cause memory leaks in JavaScript", explanationIfWrong: "Security exposure is the critical risk, not memory leaks." },
            { id: "D", text: "Database drivers only accept encrypted passwords", explanationIfWrong: "Connection URIs are read as strings from process.env." }
          ],
          correctAnswer: "A",
          explanationNote: "Hardcoding secrets into Git repositories is a major security vulnerability. Use environment variables (via `.env` and `dotenv`) instead."
        }
      }
    ]
  },
  {
    id: "3-5-mongodb-atlas-mongoose-odm",
    number: "3.5",
    title: "MongoDB Atlas & Mongoose ODM",
    subtitle: "Connect to cloud MongoDB Atlas clusters, define schemas and models with Mongoose, and format returned documents.",
    readTime: "16 min",
    objectives: [
      "Understand document-oriented NoSQL databases vs relational SQL databases",
      "Create and configure a cloud database cluster on MongoDB Atlas",
      "Connect Node.js to MongoDB using the Mongoose Object Document Mapper (ODM)",
      "Define Mongoose Schemas and Models for data persistence",
      "Query, create, and save documents using asynchronous Mongoose methods",
      "Format returned MongoDB documents (convert _id to id and strip __v)"
    ],
    theoryBlocks: [
      {
        heading: "Document Databases (MongoDB) vs Relational (SQL)",
        text: "MongoDB is a NoSQL document database. Instead of rigid tables with rows and columns, MongoDB stores data in flexible JSON-like documents (BSON).",
        codeSnippet: `// Document in MongoDB 'notes' collection:\n{\n  "_id": ObjectId("64f1a2b3c4d5e6f7a8b9c0d1"),\n  "content": "HTML is easy",\n  "important": true\n}`,
        terminalOutput: `Flexible document schema: Each document can have dynamic fields`,
        mcq: {
          id: "q-3.5-0-v1",
          question: "How does MongoDB organize and store data compared to traditional relational SQL databases?",
          options: [
            { id: "A", text: "In collections containing flexible JSON-like documents (BSON), rather than tables with fixed rows and columns", explanationIfWrong: "" },
            { id: "B", text: "In CSV text files stored on desktop folders", explanationIfWrong: "MongoDB is a database engine, not raw CSV files." },
            { id: "C", text: "In HTML table elements", explanationIfWrong: "Databases do not store HTML tags." },
            { id: "D", text: "In compiled C++ binary executables", explanationIfWrong: "MongoDB stores data documents in BSON format." }
          ],
          correctAnswer: "A",
          explanationNote: "MongoDB is a document database where records are stored as flexible, self-contained BSON (Binary JSON) documents inside collections."
        },
        retestMcq: {
          id: "q-3.5-0-v2",
          question: "What is a 'collection' in MongoDB analogous to in a relational SQL database?",
          options: [
            { id: "A", text: "A table", explanationIfWrong: "" },
            { id: "B", text: "A single row", explanationIfWrong: "A row corresponds to a single document." },
            { id: "C", text: "A column header", explanationIfWrong: "A column header corresponds to a field/property." },
            { id: "D", text: "A foreign key constraint", explanationIfWrong: "Collections store groups of documents, like SQL tables store rows." }
          ],
          correctAnswer: "A",
          explanationNote: "In MongoDB, a collection is a grouping of documents, which directly mirrors a table in relational database terminology."
        }
      },
      {
        heading: "Connecting with Mongoose ODM",
        text: "Mongoose is an Object Document Mapper (ODM) that provides schema validation, type casting, and query building for MongoDB in Node.js.",
        codeSnippet: `const mongoose = require('mongoose');\nconst url = process.env.MONGODB_URI;\n\nmongoose.set('strictQuery', false);\nmongoose.connect(url)\n  .then(() => console.log('Connected to MongoDB Atlas!'))\n  .catch(err => console.error('Error connecting to MongoDB:', err.message));`,
        terminalOutput: `Connected to MongoDB Atlas!`,
        mcq: {
          id: "q-3.5-1-v1",
          question: "What is Mongoose in a Node.js and MongoDB application stack?",
          options: [
            { id: "A", text: "An Object Document Mapper (ODM) library that models application data with schemas, validations, and query helpers", explanationIfWrong: "" },
            { id: "B", text: "A cloud database hosting platform owned by Microsoft", explanationIfWrong: "MongoDB Atlas is the cloud host; Mongoose is a JavaScript library." },
            { id: "C", text: "A CSS layout utility for responsive grids", explanationIfWrong: "Mongoose is a backend database library." },
            { id: "D", text: "An HTTP server that replaces Express", explanationIfWrong: "Mongoose works alongside Express to manage MongoDB." }
          ],
          correctAnswer: "A",
          explanationNote: "Mongoose provides a higher-level abstraction over the native MongoDB driver, enforcing schemas, validations, and relationships in JavaScript."
        },
        retestMcq: {
          id: "q-3.5-1-v2",
          question: "Where should the MongoDB connection string (`MONGODB_URI`) be stored in a project?",
          options: [
            { id: "A", text: "In an environment variable defined in a `.env` file (which is git-ignored)", explanationIfWrong: "" },
            { id: "B", text: "Hardcoded directly into index.html", explanationIfWrong: "Client-side HTML would expose database credentials to the public." },
            { id: "C", text: "Committed to a public GitHub repository", explanationIfWrong: "Exposing credentials leads to automated database attacks." },
            { id: "D", text: "Printed on the homepage header", explanationIfWrong: "Never display database passwords publicly." }
          ],
          correctAnswer: "A",
          explanationNote: "Database credentials belong in environment variables via `.env`. The `.env` file must always be included in `.gitignore`."
        }
      },
      {
        heading: "Defining Mongoose Schemas & Models",
        text: "A Schema defines the structure and types of the document. A Model is a constructor function compiled from the Schema that provides methods to query and save documents.",
        codeSnippet: `const noteSchema = new mongoose.Schema({\n  content: String,\n  important: Boolean\n});\n\n// Model constructor:\nconst Note = mongoose.model('Note', noteSchema);`,
        terminalOutput: `Mongoose creates and targets the lowercase plural 'notes' collection in MongoDB`,
        mcq: {
          id: "q-3.5-2-v1",
          question: "When you define `mongoose.model('Note', noteSchema)`, what collection name does MongoDB create by default?",
          options: [
            { id: "A", text: "`notes` (lowercased and pluralized)", explanationIfWrong: "" },
            { id: "B", text: "`Note_TABLE`", explanationIfWrong: "Mongoose uses lowercased plurals by convention." },
            { id: "C", text: "`DOCUMENT_NOTE`", explanationIfWrong: "Default naming is plural lowercase." },
            { id: "D", text: "A random 32-character hash", explanationIfWrong: "Collection names are human-readable." }
          ],
          correctAnswer: "A",
          explanationNote: "Mongoose automatically lowercases and pluralizes the model name: `'Note'` maps to the `'notes'` collection."
        },
        retestMcq: {
          id: "q-3.5-2-v2",
          question: "What is the difference between a Mongoose Schema and a Mongoose Model?",
          options: [
            { id: "A", text: "A Schema defines the document shape and field types; a Model is the compiled constructor used to create, query, and save documents", explanationIfWrong: "" },
            { id: "B", text: "A Schema runs in the browser, while a Model runs in Node.js", explanationIfWrong: "Both run inside Node.js on the server." },
            { id: "C", text: "Schemas are for SQL databases, while Models are for NoSQL", explanationIfWrong: "Mongoose is strictly for MongoDB." },
            { id: "D", text: "There is no difference; they are identical aliases", explanationIfWrong: "Schemas describe data; Models provide database operations." }
          ],
          correctAnswer: "A",
          explanationNote: "The Schema acts as the blueprint; compiling it into a Model provides methods like `Note.find()`, `Note.findById()`, and `new Note()`."
        }
      },
      {
        heading: "Querying Documents with `Model.find()`",
        text: "Fetch documents from MongoDB using `Note.find({})`. Passing an empty object `{}` returns all documents in the collection.",
        codeSnippet: `app.get('/api/notes', (request, response) => {\n  Note.find({}).then(notes => {\n    response.json(notes);\n  });\n});`,
        terminalOutput: `Returns all notes from MongoDB Atlas cloud database`,
        mcq: {
          id: "q-3.5-3-v1",
          question: "What does `Note.find({})` return when executed in an Express route?",
          options: [
            { id: "A", text: "A Promise that resolves to an array of all documents in the 'notes' collection", explanationIfWrong: "" },
            { id: "B", text: "A single random note document", explanationIfWrong: "find({}) returns an array of all matches." },
            { id: "C", text: "The total memory size in gigabytes", explanationIfWrong: "It returns document data." },
            { id: "D", text: "A boolean indicating if the database is online", explanationIfWrong: "It executes a query returning documents." }
          ],
          correctAnswer: "A",
          explanationNote: "`Model.find({})` with an empty search criteria query matches and returns all documents stored in that collection."
        },
        retestMcq: {
          id: "q-3.5-3-v2",
          question: "How do you find a single document by its unique MongoDB identifier in Mongoose?",
          options: [
            { id: "A", text: "`Note.findById(request.params.id)`", explanationIfWrong: "" },
            { id: "B", text: "`Note.selectWhereIdEquals(request.params.id)`", explanationIfWrong: "Mongoose uses findById or findOne." },
            { id: "C", text: "`Note.grep(id)`", explanationIfWrong: "grep is a Unix terminal utility." },
            { id: "D", text: "`Note.filter(id)`", explanationIfWrong: "filter is an in-memory JS array method." }
          ],
          correctAnswer: "A",
          explanationNote: "Mongoose provides `Model.findById(id)` as a convenience helper to find a document matching its unique MongoDB `_id`."
        }
      },
      {
        heading: "Transforming `_id` and Stripping `__v`",
        text: "MongoDB stores IDs as `_id: ObjectId(...)` and includes a version key `__v`. Configure Mongoose's `toJSON` transform to convert `_id` to a clean string `id` and remove `__v`.",
        codeSnippet: `noteSchema.set('toJSON', {\n  transform: (document, returnedObject) => {\n    returnedObject.id = returnedObject._id.toString();\n    delete returnedObject._id;\n    delete returnedObject.__v;\n  }\n});`,
        terminalOutput: `Clean frontend JSON format: { id: "64f1a2b...", content: "...", important: true }`,
        mcq: {
          id: "q-3.5-4-v1",
          question: "Why does Helsinki Full Stack Open recommend configuring the `toJSON` transform on Mongoose schemas?",
          options: [
            { id: "A", text: "To convert MongoDB's `_id` object into a clean string `id` and remove the internal `__v` versioning property for frontend consumers", explanationIfWrong: "" },
            { id: "B", text: "To encrypt the document before sending to the client", explanationIfWrong: "It normalizes property names, not encryption." },
            { id: "C", text: "Because React crashes if an object has an underscore in a key name", explanationIfWrong: "React handles underscores; standardizing on 'id' is for clean architecture." },
            { id: "D", text: "To compress JSON into binary format", explanationIfWrong: "It formats JSON properties." }
          ],
          correctAnswer: "A",
          explanationNote: "Transforming `_id` to a string `id` and removing `__v` adheres to REST standards and ensures clean, predictable APIs for frontend consumption."
        },
        retestMcq: {
          id: "q-3.5-4-v2",
          question: "What is MongoDB's `_id` by default in Mongoose documents?",
          options: [
            { id: "A", text: "An `ObjectId` instance representing a 12-byte unique identifier containing a timestamp and machine hash", explanationIfWrong: "" },
            { id: "B", text: "A simple integer starting at 1, 2, 3...", explanationIfWrong: "Relational SQL auto-increments; MongoDB uses 12-byte ObjectIds." },
            { id: "C", text: "A random four-letter word", explanationIfWrong: "ObjectIds are 24-character hexadecimal strings." },
            { id: "D", text: "The user's MAC address", explanationIfWrong: "ObjectIds are structured database keys." }
          ],
          correctAnswer: "A",
          explanationNote: "MongoDB assigns a unique 12-byte `ObjectId` composed of timestamp, machine identifier, process ID, and counter to guarantee global uniqueness."
        }
      },
      {
        heading: "Saving New Documents to MongoDB",
        text: "Create a new document using the Model constructor, then call `.save()` to persist it to the database.",
        codeSnippet: `app.post('/api/notes', (request, response) => {\n  const body = request.body;\n\n  const note = new Note({\n    content: body.content,\n    important: body.important || false\n  });\n\n  note.save().then(savedNote => {\n    response.status(201).json(savedNote);\n  });\n});`,
        terminalOutput: `Document persisted to MongoDB Atlas cloud -> 201 Created returned`,
        mcq: {
          id: "q-3.5-5-v1",
          question: "What does calling `note.save()` do on a Mongoose model instance?",
          options: [
            { id: "A", text: "It validates the document and asynchronously inserts it into the MongoDB collection, returning a Promise", explanationIfWrong: "" },
            { id: "B", text: "It saves the document to the browser's cookies", explanationIfWrong: "Mongoose communicates with MongoDB, not browser cookies." },
            { id: "C", text: "It converts the note into an image file", explanationIfWrong: "No image generation occurs." },
            { id: "D", text: "It shuts down the Express server", explanationIfWrong: "The server continues running." }
          ],
          correctAnswer: "A",
          explanationNote: "`.save()` validates the model against the schema and writes the document permanently to the MongoDB database."
        },
        retestMcq: {
          id: "q-3.5-5-v2",
          question: "In `note.save().then(savedNote => ...)`, what is `savedNote`?",
          options: [
            { id: "A", text: "The persisted document returned by MongoDB, containing its assigned `_id` and all saved fields", explanationIfWrong: "" },
            { id: "B", text: "A boolean indicating database connection status", explanationIfWrong: "It is the actual saved document object." },
            { id: "C", text: "An error message string", explanationIfWrong: "Errors are handled in .catch()." },
            { id: "D", text: "undefined", explanationIfWrong: "Mongoose resolves with the saved document." }
          ],
          correctAnswer: "A",
          explanationNote: "Mongoose resolves the Promise with the exact document saved in the database, including default values and generated IDs."
        }
      }
    ]
  },
  {
    id: "3-6-validation-error-handling-eslint",
    number: "3.6",
    title: "Database Validation, Error Handling & ESLint",
    subtitle: "Enforce schema validation rules, structure centralized error-handling middleware, and configure ESLint for code quality.",
    readTime: "15 min",
    objectives: [
      "Define built-in Mongoose schema validators (required, minLength, enum)",
      "Forward database errors to centralized error-handling middleware via next(error)",
      "Catch CastError and ValidationError to return clean HTTP 400 Bad Request responses",
      "Understand why findByIdAndUpdate requires { runValidators: true }",
      "Configure ESLint to detect syntax errors and enforce code style rules",
      "Format and lint code automatically before Git commits"
    ],
    theoryBlocks: [
      {
        heading: "Mongoose Schema Validation Rules",
        text: "Mongoose allows defining validation rules directly on schema properties, such as `required: true` and `minLength: 5`, ensuring invalid data is rejected before saving.",
        codeSnippet: `const noteSchema = new mongoose.Schema({\n  content: {\n    type: String,\n    minLength: 5,\n    required: true\n  },\n  important: Boolean\n});`,
        terminalOutput: `Rejects notes shorter than 5 characters: ValidationError: Path \`content\` is shorter than minimum allowed length (5).`,
        mcq: {
          id: "q-3.6-0-v1",
          question: "What happens if a client attempts to save a note with `content: 'Hi'` when the schema specifies `minLength: 5`?",
          options: [
            { id: "A", text: "Mongoose throws a `ValidationError` and refuses to write the document to the database", explanationIfWrong: "" },
            { id: "B", text: "MongoDB pads the string with spaces to reach 5 characters automatically", explanationIfWrong: "Mongoose validates and rejects; it does not alter or pad user text." },
            { id: "C", text: "The note is saved anyway because validation is purely optional", explanationIfWrong: "Validation fails and rejects the save." },
            { id: "D", text: "The server crashes and cannot restart", explanationIfWrong: "Errors should be caught and handled with next(error)." }
          ],
          correctAnswer: "A",
          explanationNote: "When validation rules fail, Mongoose halts execution and returns a `ValidationError` without modifying the database."
        },
        retestMcq: {
          id: "q-3.6-0-v2",
          question: "Which of the following is a built-in Mongoose schema validator for String fields?",
          options: [
            { id: "A", text: "`minLength`, `maxLength`, `required`, and `enum`", explanationIfWrong: "" },
            { id: "B", text: "`fontFamily`", explanationIfWrong: "fontFamily is a CSS property." },
            { id: "C", text: "`autoTranslate`", explanationIfWrong: "Mongoose does not translate text." },
            { id: "D", text: "`encrypt`", explanationIfWrong: "Encryption is not a built-in schema validator." }
          ],
          correctAnswer: "A",
          explanationNote: "Mongoose provides built-in validators for strings including `required`, `minLength`, `maxLength`, `match` (regex), and `enum`."
        }
      },
      {
        heading: "Forwarding Errors with `next(error)`",
        text: "Instead of writing duplicate `.catch()` handlers with custom status codes in every route, forward errors to a centralized error-handling middleware using `next(error)`.",
        codeSnippet: `app.get('/api/notes/:id', (request, response, next) => {\n  Note.findById(request.params.id)\n    .then(note => {\n      if (note) response.json(note);\n      else response.status(404).end();\n    })\n    .catch(error => next(error)); // Forward to error middleware!\n});`,
        terminalOutput: `Clean routing: Error forwarded down the pipeline to centralized handler`,
        mcq: {
          id: "q-3.6-1-v1",
          question: "What happens when you pass an error object to `next(error)` inside a route handler?",
          options: [
            { id: "A", text: "Express skips all remaining normal route handlers and jumps directly to the nearest error-handling middleware", explanationIfWrong: "" },
            { id: "B", text: "Express retries the database query 10 times", explanationIfWrong: "next(error) delegates to error handlers, not retries." },
            { id: "C", text: "The error is swallowed silently and ignored", explanationIfWrong: "It delegates to the error middleware for processing." },
            { id: "D", text: "It restarts the Node process", explanationIfWrong: "The process continues running." }
          ],
          correctAnswer: "A",
          explanationNote: "Calling `next(error)` with an argument triggers Express's error pipeline, bypassing normal routes and executing error middleware."
        },
        retestMcq: {
          id: "q-3.6-1-v2",
          question: "Can `next(error)` be written concisely as `.catch(error => next(error))`?",
          options: [
            { id: "A", text: "Yes, and even more concisely as `.catch(next)`", explanationIfWrong: "" },
            { id: "B", text: "No, next must always be called inside a try/catch block", explanationIfWrong: "Promise .catch(next) is completely valid and standard." },
            { id: "C", text: "No, passing next directly causes memory corruption", explanationIfWrong: "Passing a function reference is standard JavaScript." },
            { id: "D", text: "Only in TypeScript", explanationIfWrong: "This is standard JavaScript Promise handling." }
          ],
          correctAnswer: "A",
          explanationNote: "Because `next` is a function that accepts an error, `.catch(next)` forwards the error directly without an intermediate arrow function."
        }
      },
      {
        heading: "Centralized Error Handler Middleware",
        text: "A centralized error handler inspects error names (like `CastError` or `ValidationError`) and formats consistent HTTP error responses.",
        codeSnippet: `const errorHandler = (error, request, response, next) => {\n  console.error(error.message);\n\n  if (error.name === 'CastError') {\n    return response.status(400).send({ error: 'malformatted id' });\n  } else if (error.name === 'ValidationError') {\n    return response.status(400).json({ error: error.message });\n  }\n\n  next(error); // Default Express error handler\n};\n\napp.use(errorHandler);`,
        terminalOutput: `CastError -> 400 Bad Request { error: 'malformatted id' }`,
        mcq: {
          id: "q-3.6-2-v1",
          question: "What causes Mongoose to throw a `CastError` in `Note.findById(request.params.id)`?",
          options: [
            { id: "A", text: "The provided ID string is not a valid 24-character hexadecimal MongoDB ObjectId format", explanationIfWrong: "" },
            { id: "B", text: "The database password was wrong", explanationIfWrong: "Authentication failures throw connection errors, not CastError." },
            { id: "C", text: "The document was found successfully", explanationIfWrong: "Successful queries do not throw errors." },
            { id: "D", text: "The client disconnected from WiFi", explanationIfWrong: "CastError is a format casting failure in Mongoose." }
          ],
          correctAnswer: "A",
          explanationNote: "If an ID like `'abc'` is passed to `findById`, Mongoose cannot cast it to an `ObjectId`, throwing a `CastError`."
        },
        retestMcq: {
          id: "q-3.6-2-v2",
          question: "What HTTP status code should be returned when a Mongoose `ValidationError` occurs on creation or update?",
          options: [
            { id: "A", text: "400 Bad Request", explanationIfWrong: "" },
            { id: "B", text: "404 Not Found", explanationIfWrong: "404 is for missing resources, not invalid fields." },
            { id: "C", text: "500 Internal Server Error", explanationIfWrong: "500 implies a bug on the server, whereas invalid input is a client error." },
            { id: "D", text: "200 OK", explanationIfWrong: "Validation failures must not return success." }
          ],
          correctAnswer: "A",
          explanationNote: "400 Bad Request correctly informs the client that their submitted payload failed schema validation constraints."
        }
      },
      {
        heading: "Validations on Update (`findByIdAndUpdate`)",
        text: "By default, Mongoose does NOT run schema validations when updating documents. You must explicitly pass `{ runValidators: true }` in the options object.",
        codeSnippet: `app.put('/api/notes/:id', (request, response, next) => {\n  const { content, important } = request.body;\n\n  Note.findByIdAndUpdate(\n    request.params.id,\n    { content, important },\n    { new: true, runValidators: true, context: 'query' }\n  )\n    .then(updatedNote => response.json(updatedNote))\n    .catch(error => next(error));\n});`,
        terminalOutput: `Ensures minLength and required validations are enforced on PUT/PATCH updates`,
        mcq: {
          id: "q-3.6-3-v1",
          question: "Why must `{ runValidators: true }` be passed to `findByIdAndUpdate()` in Mongoose?",
          options: [
            { id: "A", text: "By default, Mongoose only validates documents during `save()`, not during updates; passing this option forces validations to execute", explanationIfWrong: "" },
            { id: "B", text: "To encrypt the updated document", explanationIfWrong: "runValidators checks schema constraints, not encryption." },
            { id: "C", text: "To delete the old document copy", explanationIfWrong: "Updates modify documents in-place." },
            { id: "D", text: "To prevent other users from reading the note", explanationIfWrong: "It enforces schema validation rules on the update payload." }
          ],
          correctAnswer: "A",
          explanationNote: "Mongoose update operations bypass schema validation by default for performance unless `{ runValidators: true }` is explicitly provided."
        },
        retestMcq: {
          id: "q-3.6-3-v2",
          question: "What does the option `{ new: true }` do in `findByIdAndUpdate`?",
          options: [
            { id: "A", text: "It causes the promise to resolve with the modified document rather than the original pre-update document", explanationIfWrong: "" },
            { id: "B", text: "It creates a brand new database collection", explanationIfWrong: "It affects the returned document instance." },
            { id: "C", text: "It forces a new random ID to be generated", explanationIfWrong: "The ID remains unchanged." },
            { id: "D", text: "It clears all other fields in the document", explanationIfWrong: "Only specified fields are updated." }
          ],
          correctAnswer: "A",
          explanationNote: "By default, `findByIdAndUpdate` returns the document as it was BEFORE the update. `{ new: true }` returns the updated document."
        }
      },
      {
        heading: "Code Quality & Linting with ESLint",
        text: "ESLint statically analyzes JavaScript code to find syntax issues, flag unused variables, and enforce consistent code formatting across the codebase.",
        codeSnippet: `// .eslintrc.js:\nmodule.exports = {\n  env: { node: true, es2021: true },\n  extends: 'eslint:recommended',\n  rules: {\n    'no-unused-vars': 'error',\n    'eqeqeq': 'error',\n    'semi': ['error', 'always']\n  }\n};\n\n// Run in terminal: npm run lint`,
        terminalOutput: `0 errors, 0 warnings -> Code adheres to strict professional standards`,
        mcq: {
          id: "q-3.6-4-v1",
          question: "What is the primary role of ESLint in a JavaScript / Node.js development workflow?",
          options: [
            { id: "A", text: "A static code analysis tool that identifies problematic patterns, enforces styling conventions, and prevents bugs before runtime", explanationIfWrong: "" },
            { id: "B", text: "A database query optimizer", explanationIfWrong: "ESLint analyzes source code, not database queries." },
            { id: "C", text: "A web browser extension for taking screenshots", explanationIfWrong: "ESLint is a CLI developer tool." },
            { id: "D", text: "A cloud deployment platform", explanationIfWrong: "ESLint is a code quality linter." }
          ],
          correctAnswer: "A",
          explanationNote: "ESLint parses code into an Abstract Syntax Tree (AST) to detect bugs, enforce best practices, and maintain consistent code styling."
        },
        retestMcq: {
          id: "q-3.6-4-v2",
          question: "What does the ESLint rule `'eqeqeq': 'error'` enforce?",
          options: [
            { id: "A", text: "Requires the use of type-safe strict equality operators (`===` and `!==`) instead of loose equality (`==` and `!=`)", explanationIfWrong: "" },
            { id: "B", text: "Requires every variable to equal 3", explanationIfWrong: "eqeqeq stands for 'triple equals'." },
            { id: "C", text: "Forbids assigning values to variables", explanationIfWrong: "It enforces strict equality comparisons." },
            { id: "D", text: "Requires three comments per function", explanationIfWrong: "It is a comparison operator rule." }
          ],
          correctAnswer: "A",
          explanationNote: "`eqeqeq` eliminates subtle JavaScript type coercion bugs by mandating strict comparison operators (`===` and `!==`)."
        }
      },
      {
        heading: "Synthesizing Part 3: Production Backend Architecture",
        text: "A production Express app separates routes, controllers, middleware, and Mongoose database models into a structured, maintainable architecture ready for deployment.",
        codeSnippet: `// Project Structure:\n├── index.js           # Server entry point & app.listen()\n├── app.js             # Express app setup & middleware\n├── models/\n│   └── note.js        # Mongoose Schema & toJSON transform\n├── controllers/\n│   └── notes.js       # Route handlers & business logic\n└── utils/\n    └── middleware.js  # Logger, errorHandler, unknownEndpoint`,
        terminalOutput: `Scalable, industry-standard full-stack backend architecture!`,
        mcq: {
          id: "q-3.6-5-v1",
          question: "Why should `index.js` only call `app.listen()` while `app.js` configures routes and middleware?",
          options: [
            { id: "A", text: "It allows testing the Express app with Supertest without having to start a real network port listener", explanationIfWrong: "" },
            { id: "B", text: "Node.js forbids having routes and listen in the same file", explanationIfWrong: "They can be in the same file, but separation facilitates automated testing." },
            { id: "C", text: "To prevent MongoDB from disconnecting", explanationIfWrong: "Database connections are independent of file separation." },
            { id: "D", text: "To make the file smaller than 1 kilobyte", explanationIfWrong: "File separation is an architectural pattern for testability." }
          ],
          correctAnswer: "A",
          explanationNote: "Separating app configuration (`app.js`) from port listening (`index.js`) allows test suites (Supertest in Part 4) to test HTTP routes without port collisions."
        },
        retestMcq: {
          id: "q-3.6-5-v2",
          question: "What core full-stack milestone is achieved upon finishing Helsinki Full Stack Open Part 3?",
          options: [
            { id: "A", text: "A complete end-to-end full-stack application with a React frontend, Express REST backend, and cloud MongoDB database deployed live", explanationIfWrong: "" },
            { id: "B", text: "Building an iOS app in Swift", explanationIfWrong: "Swift is for native iOS; Part 3 is Node/React/MongoDB." },
            { id: "C", text: "Writing an operating system kernel", explanationIfWrong: "Part 3 is web application engineering." },
            { id: "D", text: "Configuring a printer driver", explanationIfWrong: "It is a full-stack web milestone." }
          ],
          correctAnswer: "A",
          explanationNote: "Part 3 completes the fundamental triad of modern full-stack web engineering: React SPA frontend, Express REST API, and MongoDB persistence."
        }
      }
    ]
  }
];

// Helper functions for Level attempts, question selection, and 3-consecutive-failure progression lock
export const getLevelAttemptCountFullstackPart3 = (sectionId: string, studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_fullstack_p3_attempt_${sectionId}_${studentId}`);
    return saved ? Number(saved) : 1;
  } catch {
    return 1;
  }
};

export const setLevelAttemptCountFullstackPart3 = (sectionId: string, studentId: string, count: number): void => {
  try {
    localStorage.setItem(`dopilot_fullstack_p3_attempt_${sectionId}_${studentId}`, String(count));
  } catch {}
};

export const getActiveQuestionsForLevelFullstackPart3 = (
  section: SectionContent,
  studentId: string,
  forceRetest: boolean = false
): McqQuestion[] => {
  const attempt = forceRetest ? 2 : getLevelAttemptCountFullstackPart3(section.id, studentId);
  return section.theoryBlocks.map((block) => {
    if (attempt >= 2 && block.retestMcq) {
      return block.retestMcq;
    }
    return block.mcq!;
  });
};

export const getConsecutiveFailedLevelsFullstackPart3 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_fullstack_p3_failed_levels_streak_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const recordLevelAttemptResultFullstackPart3 = (
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
  const currentAttempt = getLevelAttemptCountFullstackPart3(sectionId, studentId);

  if (isPassed) {
    try {
      localStorage.setItem(`dopilot_fullstack_p3_failed_levels_streak_${studentId}`, '0');
      localStorage.setItem(`dopilot_fullstack_p3_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_fullstack_p3_attempt_${sectionId}_${studentId}`, '1');
      localStorage.removeItem(`dopilot_fullstack_p3_locked_${studentId}`);
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
      setLevelAttemptCountFullstackPart3(sectionId, studentId, 2);
      const streak = getConsecutiveFailedLevelsFullstackPart3(studentId);

      return {
        isPassed: false,
        attemptCount: 1,
        isSecondFailureInLevel: false,
        consecutiveFailedLevels: streak,
        isLocked: false
      };
    } else {
      const prevStreak = getConsecutiveFailedLevelsFullstackPart3(studentId);
      const newStreak = prevStreak + 1;
      const isLocked = newStreak >= 3;

      try {
        localStorage.setItem(`dopilot_fullstack_p3_failed_levels_streak_${studentId}`, String(newStreak));
        localStorage.setItem(`dopilot_fullstack_p3_consecutive_failures_${studentId}`, String(newStreak));
        if (isLocked) {
          localStorage.setItem(`dopilot_fullstack_p3_locked_${studentId}`, 'true');
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

export const resetConsecutiveFailuresFullstackPart3 = (studentId: string): void => {
  try {
    localStorage.setItem(`dopilot_fullstack_p3_consecutive_failures_${studentId}`, '0');
    localStorage.setItem(`dopilot_fullstack_p3_failed_levels_streak_${studentId}`, '0');
    localStorage.removeItem(`dopilot_fullstack_p3_locked_${studentId}`);
  } catch {}
};
