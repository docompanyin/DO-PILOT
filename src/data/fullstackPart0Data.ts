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

export const FULLSTACK_PART_0_SECTIONS: SectionContent[] = [
  {
    id: "0-1-http-protocol",
    number: "0.1",
    title: "HTTP Protocol & Web Request-Response Lifecycle",
    subtitle: "Understand client-server architecture, HTTP methods, headers, status codes, and inspecting network traffic.",
    readTime: "15 min",
    objectives: [
      "Understand the HTTP request-response lifecycle between browser and server",
      "Differentiate between HTTP methods: GET, POST, PUT, and DELETE",
      "Interpret standard HTTP status codes: 200 OK, 302 Redirect, 404 Not Found, 500 Server Error",
      "Analyze HTTP headers, Content-Type, and content negotiation",
      "Inspect live network traffic using Browser Developer Tools Network tab",
      "Understand statelessness in HTTP and state persistence mechanisms"
    ],
    theoryBlocks: [
      {
        heading: "HTTP Protocol & Client-Server Architecture",
        text: "The web operates on HTTP. The client (browser) initiates requests over TCP/IP, and the server returns a response containing a status code and content.",
        codeSnippet: `GET /index.html HTTP/1.1\nHost: fullstackopen.com\nAccept: text/html`,
        terminalOutput: `HTTP/1.1 200 OK\nContent-Type: text/html\n\n<h1>Full Stack Open</h1>`,
        mcq: {
          id: "q-0.1-0-v1",
          question: "Which communication protocol governs how web browsers request and receive resources from web servers?",
          options: [
            { id: "A", text: "HTTP / HTTPS", explanationIfWrong: "" },
            { id: "B", text: "FTP (File Transfer Protocol)", explanationIfWrong: "FTP is used for direct file transfer, not web page delivery." },
            { id: "C", text: "SMTP (Simple Mail Transfer Protocol)", explanationIfWrong: "SMTP is designed exclusively for sending electronic mail." },
            { id: "D", text: "SSH (Secure Shell)", explanationIfWrong: "SSH is a cryptographic network protocol for remote terminal logins." }
          ],
          correctAnswer: "A",
          explanationNote: "HTTP (Hypertext Transfer Protocol) and its secure counterpart HTTPS are the foundation of data communication on the World Wide Web."
        },
        retestMcq: {
          id: "q-0.1-0-v2",
          question: "In standard client-server web architecture over HTTP, which party must initiate the communication cycle?",
          options: [
            { id: "A", text: "The Client (Browser) initiates the request", explanationIfWrong: "" },
            { id: "B", text: "The Server spontaneously pushes requests without client action", explanationIfWrong: "In standard HTTP, the server cannot arbitrarily initiate a connection." },
            { id: "C", text: "The Internet Service Provider (ISP) initiates all handshakes", explanationIfWrong: "The ISP merely routes packets; client and server communicate directly." },
            { id: "D", text: "The Database engine triggers the initial request", explanationIfWrong: "The database is behind the backend server and never initiates browser calls." }
          ],
          correctAnswer: "A",
          explanationNote: "In standard HTTP client-server architecture, the client (browser) always initiates requests to which the server responds."
        },
        questionPool: [
          {
            id: "q-0.1-0-v1",
            question: "Which communication protocol governs how web browsers request and receive resources from web servers?",
            options: [
              { id: "A", text: "HTTP / HTTPS", explanationIfWrong: "" },
              { id: "B", text: "FTP (File Transfer Protocol)", explanationIfWrong: "FTP is used for direct file transfer, not web page delivery." },
              { id: "C", text: "SMTP (Simple Mail Transfer Protocol)", explanationIfWrong: "SMTP is designed exclusively for sending electronic mail." },
              { id: "D", text: "SSH (Secure Shell)", explanationIfWrong: "SSH is a cryptographic network protocol for remote terminal logins." }
            ],
            correctAnswer: "A",
            explanationNote: "HTTP (Hypertext Transfer Protocol) and its secure counterpart HTTPS are the foundation of data communication on the World Wide Web."
          },
          {
            id: "q-0.1-0-v2",
            question: "In standard client-server web architecture over HTTP, which party must initiate the communication cycle?",
            options: [
              { id: "A", text: "The Client (Browser) initiates the request", explanationIfWrong: "" },
              { id: "B", text: "The Server spontaneously pushes requests without client action", explanationIfWrong: "In standard HTTP, the server cannot arbitrarily initiate a connection." },
              { id: "C", text: "The Internet Service Provider (ISP) initiates all handshakes", explanationIfWrong: "The ISP merely routes packets; client and server communicate directly." },
              { id: "D", text: "The Database engine triggers the initial request", explanationIfWrong: "The database is behind the backend server and never initiates browser calls." }
            ],
            correctAnswer: "A",
            explanationNote: "In standard HTTP client-server architecture, the client (browser) always initiates requests to which the server responds."
          }
        ]
      },
      {
        heading: "HTTP Request Methods (GET, POST, PUT, DELETE)",
        text: "HTTP methods describe the intended action. GET retrieves data safely without changing server state, while POST submits data to create resources.",
        codeSnippet: `// Common HTTP Methods:\n// GET /api/notes   -> Retrieve notes\n// POST /api/notes  -> Create a note`,
        terminalOutput: `POST /api/notes -> 201 Created`,
        mcq: {
          id: "q-0.1-1-v1",
          question: "Which HTTP request method is specifically designed to retrieve data from a server without modifying server state?",
          options: [
            { id: "A", text: "GET", explanationIfWrong: "" },
            { id: "B", text: "POST", explanationIfWrong: "POST is designed for submitting data to create or mutate resources." },
            { id: "C", text: "DELETE", explanationIfWrong: "DELETE is used to remove an existing resource." },
            { id: "D", text: "PATCH", explanationIfWrong: "PATCH is used for partial resource modifications." }
          ],
          correctAnswer: "A",
          explanationNote: "The HTTP GET method requests a representation of the specified resource without altering server state."
        },
        retestMcq: {
          id: "q-0.1-1-v2",
          question: "When a user submits a web form to create a new user account or write a new note, which HTTP method is sent?",
          options: [
            { id: "A", text: "POST", explanationIfWrong: "" },
            { id: "B", text: "GET", explanationIfWrong: "GET is for retrieving resources, not creating new ones." },
            { id: "C", text: "HEAD", explanationIfWrong: "HEAD retrieves response headers only, without response body." },
            { id: "D", text: "OPTIONS", explanationIfWrong: "OPTIONS describes the communication options for the target resource." }
          ],
          correctAnswer: "A",
          explanationNote: "The HTTP POST method submits an entity to the specified resource, frequently causing a change in state or side effects on the server."
        },
        questionPool: [
          {
            id: "q-0.1-1-v1",
            question: "Which HTTP request method is specifically designed to retrieve data from a server without modifying server state?",
            options: [
              { id: "A", text: "GET", explanationIfWrong: "" },
              { id: "B", text: "POST", explanationIfWrong: "POST is designed for submitting data to create or mutate resources." },
              { id: "C", text: "DELETE", explanationIfWrong: "DELETE is used to remove an existing resource." },
              { id: "D", text: "PATCH", explanationIfWrong: "PATCH is used for partial resource modifications." }
            ],
            correctAnswer: "A",
            explanationNote: "The HTTP GET method requests a representation of the specified resource without altering server state."
          },
          {
            id: "q-0.1-1-v2",
            question: "When a user submits a web form to create a new user account or write a new note, which HTTP method is sent?",
            options: [
              { id: "A", text: "POST", explanationIfWrong: "" },
              { id: "B", text: "GET", explanationIfWrong: "GET is for retrieving resources, not creating new ones." },
              { id: "C", text: "HEAD", explanationIfWrong: "HEAD retrieves response headers only, without response body." },
              { id: "D", text: "OPTIONS", explanationIfWrong: "OPTIONS describes the communication options for the target resource." }
            ],
            correctAnswer: "A",
            explanationNote: "The HTTP POST method submits an entity to the specified resource, frequently causing a change in state or side effects on the server."
          }
        ]
      },
      {
        heading: "HTTP Response Status Codes",
        text: "The server returns a 3-digit status code. 200 means OK, 302 redirects, 404 indicates missing resources, and 500 signals internal server errors.",
        codeSnippet: `// Status code categories:\n// 2xx = Success (200 OK, 201 Created)\n// 3xx = Redirection (302 Found)\n// 4xx = Client Error (404 Not Found)\n// 5xx = Server Error (500 Internal Error)`,
        terminalOutput: `HTTP/1.1 200 OK | Status: 200`,
        mcq: {
          id: "q-0.1-2-v1",
          question: "Which HTTP status code signifies that an HTTP request has succeeded and the requested resource was returned?",
          options: [
            { id: "A", text: "200 OK", explanationIfWrong: "" },
            { id: "B", text: "404 Not Found", explanationIfWrong: "404 means the server cannot find the requested URL." },
            { id: "C", text: "500 Internal Server Error", explanationIfWrong: "500 means the server threw an unhandled exception." },
            { id: "D", text: "302 Found", explanationIfWrong: "302 is a temporary redirection instruction." }
          ],
          correctAnswer: "A",
          explanationNote: "Status code 200 OK indicates that the request succeeded and the server returned the requested payload."
        },
        retestMcq: {
          id: "q-0.1-2-v2",
          question: "If a browser requests a web page URL that does not exist on the server, which status code is sent back?",
          options: [
            { id: "A", text: "404 Not Found", explanationIfWrong: "" },
            { id: "B", text: "200 OK", explanationIfWrong: "200 indicates success, not a missing resource." },
            { id: "C", text: "201 Created", explanationIfWrong: "201 indicates a new resource was successfully created." },
            { id: "D", text: "304 Not Modified", explanationIfWrong: "304 indicates the client can use its cached copy." }
          ],
          correctAnswer: "A",
          explanationNote: "404 Not Found is the standard HTTP status code indicating that the server cannot locate the requested resource."
        },
        questionPool: [
          {
            id: "q-0.1-2-v1",
            question: "Which HTTP status code signifies that an HTTP request has succeeded and the requested resource was returned?",
            options: [
              { id: "A", text: "200 OK", explanationIfWrong: "" },
              { id: "B", text: "404 Not Found", explanationIfWrong: "404 means the server cannot find the requested URL." },
              { id: "C", text: "500 Internal Server Error", explanationIfWrong: "500 means the server threw an unhandled exception." },
              { id: "D", text: "302 Found", explanationIfWrong: "302 is a temporary redirection instruction." }
            ],
            correctAnswer: "A",
            explanationNote: "Status code 200 OK indicates that the request succeeded and the server returned the requested payload."
          },
          {
            id: "q-0.1-2-v2",
            question: "If a browser requests a web page URL that does not exist on the server, which status code is sent back?",
            options: [
              { id: "A", text: "404 Not Found", explanationIfWrong: "" },
              { id: "B", text: "200 OK", explanationIfWrong: "200 indicates success, not a missing resource." },
              { id: "C", text: "201 Created", explanationIfWrong: "201 indicates a new resource was successfully created." },
              { id: "D", text: "304 Not Modified", explanationIfWrong: "304 indicates the client can use its cached copy." }
            ],
            correctAnswer: "A",
            explanationNote: "404 Not Found is the standard HTTP status code indicating that the server cannot locate the requested resource."
          }
        ]
      },
      {
        heading: "HTTP Headers & Content Negotiation",
        text: "Headers pass metadata. The response header Content-Type specifies whether the received body is HTML (text/html) or raw data (application/json).",
        codeSnippet: `Content-Type: application/json; charset=utf-8\n\n[{ "id": 1, "content": "HTML is easy" }]`,
        terminalOutput: `MIME Type: application/json (2 items)`,
        mcq: {
          id: "q-0.1-3-v1",
          question: "Which HTTP response header tells the browser how to interpret the payload data format (e.g., HTML vs JSON)?",
          options: [
            { id: "A", text: "Content-Type", explanationIfWrong: "" },
            { id: "B", text: "User-Agent", explanationIfWrong: "User-Agent identifies the client software and OS, not the payload format." },
            { id: "C", text: "Host", explanationIfWrong: "Host specifies the domain name of the server." },
            { id: "D", text: "Referer", explanationIfWrong: "Referer contains the address of the previous web page from which a link was followed." }
          ],
          correctAnswer: "A",
          explanationNote: "Content-Type specifies the media type (MIME type) of the resource so the browser knows how to parse and render it."
        },
        retestMcq: {
          id: "q-0.1-3-v2",
          question: "Which HTTP request header does a browser client send to inform the server what content formats it can accept in return?",
          options: [
            { id: "A", text: "Accept", explanationIfWrong: "" },
            { id: "B", text: "Content-Disposition", explanationIfWrong: "Content-Disposition indicates if content is expected to be displayed inline or downloaded as attachment." },
            { id: "C", text: "Server", explanationIfWrong: "Server is a response header describing server software." },
            { id: "D", text: "ETag", explanationIfWrong: "ETag is an identifier for a specific version of a resource used for caching." }
          ],
          correctAnswer: "A",
          explanationNote: "The 'Accept' request header is used by clients to specify what media types are acceptable for the response."
        },
        questionPool: [
          {
            id: "q-0.1-3-v1",
            question: "Which HTTP response header tells the browser how to interpret the payload data format (e.g., HTML vs JSON)?",
            options: [
              { id: "A", text: "Content-Type", explanationIfWrong: "" },
              { id: "B", text: "User-Agent", explanationIfWrong: "User-Agent identifies the client software and OS, not the payload format." },
              { id: "C", text: "Host", explanationIfWrong: "Host specifies the domain name of the server." },
              { id: "D", text: "Referer", explanationIfWrong: "Referer contains the address of the previous web page from which a link was followed." }
            ],
            correctAnswer: "A",
            explanationNote: "Content-Type specifies the media type (MIME type) of the resource so the browser knows how to parse and render it."
          },
          {
            id: "q-0.1-3-v2",
            question: "Which HTTP request header does a browser client send to inform the server what content formats it can accept in return?",
            options: [
              { id: "A", text: "Accept", explanationIfWrong: "" },
              { id: "B", text: "Content-Disposition", explanationIfWrong: "Content-Disposition indicates if content is expected to be displayed inline or downloaded as attachment." },
              { id: "C", text: "Server", explanationIfWrong: "Server is a response header describing server software." },
              { id: "D", text: "ETag", explanationIfWrong: "ETag is an identifier for a specific version of a resource used for caching." }
            ],
            correctAnswer: "A",
            explanationNote: "The 'Accept' request header is used by clients to specify what media types are acceptable for the response."
          }
        ]
      },
      {
        heading: "Inspecting Web Traffic with Browser Dev Tools",
        text: "The Developer Tools Network tab shows every HTTP request in real time, including the URL, status code, size, and waterfall timeline.",
        codeSnippet: `// Open Browser Dev Tools:\n// Windows/Linux: F12 or Ctrl + Shift + I\n// Mac: Cmd + Option + I`,
        terminalOutput: `notes: 200 OK (html) | main.css: 200 OK (css)`,
        mcq: {
          id: "q-0.1-4-v1",
          question: "Which tab in Browser Developer Tools is used to view all outgoing HTTP requests, response headers, and transferred assets?",
          options: [
            { id: "A", text: "Network tab", explanationIfWrong: "" },
            { id: "B", text: "Console tab", explanationIfWrong: "Console is used for JavaScript logs and error messages." },
            { id: "C", text: "Elements tab", explanationIfWrong: "Elements tab inspects the DOM and CSS styles." },
            { id: "D", text: "Memory tab", explanationIfWrong: "Memory tab is used for profiling heap allocations and memory leaks." }
          ],
          correctAnswer: "A",
          explanationNote: "The Network tab in Developer Tools logs all HTTP requests made by the page, their headers, status codes, and timing."
        },
        retestMcq: {
          id: "q-0.1-4-v2",
          question: "In the browser Network tab, what does the 'Status' column communicate about each HTTP resource?",
          options: [
            { id: "A", text: "The numeric HTTP response code returned by the server (e.g. 200, 304, 404)", explanationIfWrong: "" },
            { id: "B", text: "The percentage of file download completed", explanationIfWrong: "That is progress/waterfall, not the HTTP status." },
            { id: "C", text: "The CPU utilization of the client computer", explanationIfWrong: "The Status column reports HTTP protocol return codes." },
            { id: "D", text: "The security rating of the user's password", explanationIfWrong: "Status represents standard HTTP response codes." }
          ],
          correctAnswer: "A",
          explanationNote: "The Status column displays the HTTP status code (such as 200 OK, 304 Not Modified, or 404 Not Found) returned by the host server."
        },
        questionPool: [
          {
            id: "q-0.1-4-v1",
            question: "Which tab in Browser Developer Tools is used to view all outgoing HTTP requests, response headers, and transferred assets?",
            options: [
              { id: "A", text: "Network tab", explanationIfWrong: "" },
              { id: "B", text: "Console tab", explanationIfWrong: "Console is used for JavaScript logs and error messages." },
              { id: "C", text: "Elements tab", explanationIfWrong: "Elements tab inspects the DOM and CSS styles." },
              { id: "D", text: "Memory tab", explanationIfWrong: "Memory tab is used for profiling heap allocations and memory leaks." }
            ],
            correctAnswer: "A",
            explanationNote: "The Network tab in Developer Tools logs all HTTP requests made by the page, their headers, status codes, and timing."
          },
          {
            id: "q-0.1-4-v2",
            question: "In the browser Network tab, what does the 'Status' column communicate about each HTTP resource?",
            options: [
              { id: "A", text: "The numeric HTTP response code returned by the server (e.g. 200, 304, 404)", explanationIfWrong: "" },
              { id: "B", text: "The percentage of file download completed", explanationIfWrong: "That is progress/waterfall, not the HTTP status." },
              { id: "C", text: "The CPU utilization of the client computer", explanationIfWrong: "The Status column reports HTTP protocol return codes." },
              { id: "D", text: "The security rating of the user's password", explanationIfWrong: "Status represents standard HTTP response codes." }
            ],
            correctAnswer: "A",
            explanationNote: "The Status column displays the HTTP status code (such as 200 OK, 304 Not Modified, or 404 Not Found) returned by the host server."
          }
        ]
      },
      {
        heading: "Statelessness of HTTP & State Persistence",
        text: "HTTP is stateless: each request is independent and the server retains no memory. Apps maintain login state using Cookies or Authorization tokens.",
        codeSnippet: `// Passing authentication token in header:\nAuthorization: Bearer eyJhbGciOiJIUzI1Ni...`,
        terminalOutput: `Authenticated Request -> 200 OK`,
        mcq: {
          id: "q-0.1-5-v1",
          question: "What does it mean that HTTP is fundamentally a 'stateless' protocol?",
          options: [
            { id: "A", text: "The server does not retain memory of previous requests automatically; each request is independent", explanationIfWrong: "" },
            { id: "B", text: "The server cannot connect to any external database", explanationIfWrong: "Servers can connect to databases; statelessness refers to HTTP request memory." },
            { id: "C", text: "The client computer cannot save files to its hard drive", explanationIfWrong: "Clients can save files; statelessness is a protocol attribute." },
            { id: "D", text: "Websites can only be visited once per day per user", explanationIfWrong: "Statelessness does not limit visit frequency." }
          ],
          correctAnswer: "A",
          explanationNote: "A stateless protocol does not require the server to retain session information or status about each communicating partner for the duration of multiple requests."
        },
        retestMcq: {
          id: "q-0.1-5-v2",
          question: "Because pure HTTP is stateless, how do modern web applications identify logged-in users across sequential requests?",
          options: [
            { id: "A", text: "By sending session identifiers or tokens in headers (Cookies or Authorization Bearer tokens)", explanationIfWrong: "" },
            { id: "B", text: "By locking the user's IP address permanently into DNS tables", explanationIfWrong: "IP addresses change frequently and are shared across networks." },
            { id: "C", text: "By keeping a continuous physical cable connection open forever", explanationIfWrong: "TCP connections terminate; HTTP state is maintained through headers/tokens." },
            { id: "D", text: "By forcing the user to retype their password on every single click", explanationIfWrong: "Tokens and cookies preserve session state automatically." }
          ],
          correctAnswer: "A",
          explanationNote: "Applications maintain state over stateless HTTP by passing state tokens (like JWTs in Authorization headers or session cookies) with each request."
        },
        questionPool: [
          {
            id: "q-0.1-5-v1",
            question: "What does it mean that HTTP is fundamentally a 'stateless' protocol?",
            options: [
              { id: "A", text: "The server does not retain memory of previous requests automatically; each request is independent", explanationIfWrong: "" },
              { id: "B", text: "The server cannot connect to any external database", explanationIfWrong: "Servers can connect to databases; statelessness refers to HTTP request memory." },
              { id: "C", text: "The client computer cannot save files to its hard drive", explanationIfWrong: "Clients can save files; statelessness is a protocol attribute." },
              { id: "D", text: "Websites can only be visited once per day per user", explanationIfWrong: "Statelessness does not limit visit frequency." }
            ],
            correctAnswer: "A",
            explanationNote: "A stateless protocol does not require the server to retain session information or status about each communicating partner for the duration of multiple requests."
          },
          {
            id: "q-0.1-5-v2",
            question: "Because pure HTTP is stateless, how do modern web applications identify logged-in users across sequential requests?",
            options: [
              { id: "A", text: "By sending session identifiers or tokens in headers (Cookies or Authorization Bearer tokens)", explanationIfWrong: "" },
              { id: "B", text: "By locking the user's IP address permanently into DNS tables", explanationIfWrong: "IP addresses change frequently and are shared across networks." },
              { id: "C", text: "By keeping a continuous physical cable connection open forever", explanationIfWrong: "TCP connections terminate; HTTP state is maintained through headers/tokens." },
              { id: "D", text: "By forcing the user to retype their password on every single click", explanationIfWrong: "Tokens and cookies preserve session state automatically." }
            ],
            correctAnswer: "A",
            explanationNote: "Applications maintain state over stateless HTTP by passing state tokens (like JWTs in Authorization headers or session cookies) with each request."
          }
        ]
      }
    ]
  },
  {
    id: "0-2-html-css-dom",
    number: "0.2",
    title: "HTML Structure, CSS Cascades & The DOM Tree",
    subtitle: "Explore document markup, stylesheet linking, CSS cascades, the CSS Box Model, and the live Document Object Model (DOM).",
    readTime: "15 min",
    objectives: [
      "Understand standard HTML5 document structure and semantic tags",
      "Explain CSS selector hierarchy, specificity, and cascading rules",
      "Analyze the Document Object Model (DOM) as an in-memory tree representation",
      "Compare external stylesheets vs inline CSS and maintainability tradeoffs",
      "Master the CSS Box Model (content, padding, border, margin)",
      "Understand mobile viewport meta tags and responsive design fundamentals"
    ],
    theoryBlocks: [
      {
        heading: "HTML Document Structure & Semantic Elements",
        text: "HTML provides page structure. The <html> root tag wraps <head> (for metadata and title) and <body> (for visible semantic content).",
        codeSnippet: `<!DOCTYPE html>\n<html>\n  <head><title>Notes</title></head>\n  <body><main><h1>Notes</h1></main></body>\n</html>`,
        terminalOutput: `Parsed HTML: html > body > main > h1`,
        mcq: {
          id: "q-0.2-0-v1",
          question: "Which HTML element serves as the root container enclosing all other tags in a valid web document?",
          options: [
            { id: "A", text: "<html>", explanationIfWrong: "" },
            { id: "B", text: "<body>", explanationIfWrong: "<body> holds only visible page contents, inside the <html> root." },
            { id: "C", text: "<head>", explanationIfWrong: "<head> holds document metadata inside the <html> root." },
            { id: "D", text: "<main>", explanationIfWrong: "<main> represents the dominant content inside the <body>." }
          ],
          correctAnswer: "A",
          explanationNote: "The <html> element represents the root of an HTML document; all other elements are descendants of this element."
        },
        retestMcq: {
          id: "q-0.2-0-v2",
          question: "Where in an HTML document are metadata declarations, page title, and stylesheet links placed?",
          options: [
            { id: "A", text: "Inside the <head> element", explanationIfWrong: "" },
            { id: "B", text: "Inside the <footer> element", explanationIfWrong: "<footer> is a visible semantic section at the bottom of the body." },
            { id: "C", text: "Directly after the closing </html> tag", explanationIfWrong: "Nothing can be written after the closing </html> tag." },
            { id: "D", text: "Inside an HTML comment tag <!-- -->", explanationIfWrong: "Comments are ignored by the browser parser." }
          ],
          correctAnswer: "A",
          explanationNote: "The <head> element is a container for metadata (document title, charset, stylesheets, scripts) and is not directly displayed to the user."
        },
        questionPool: [
          {
            id: "q-0.2-0-v1",
            question: "Which HTML element serves as the root container enclosing all other tags in a valid web document?",
            options: [
              { id: "A", text: "<html>", explanationIfWrong: "" },
              { id: "B", text: "<body>", explanationIfWrong: "<body> holds only visible page contents, inside the <html> root." },
              { id: "C", text: "<head>", explanationIfWrong: "<head> holds document metadata inside the <html> root." },
              { id: "D", text: "<main>", explanationIfWrong: "<main> represents the dominant content inside the <body>." }
            ],
            correctAnswer: "A",
            explanationNote: "The <html> element represents the root of an HTML document; all other elements are descendants of this element."
          },
          {
            id: "q-0.2-0-v2",
            question: "Where in an HTML document are metadata declarations, page title, and stylesheet links placed?",
            options: [
              { id: "A", text: "Inside the <head> element", explanationIfWrong: "" },
              { id: "B", text: "Inside the <footer> element", explanationIfWrong: "<footer> is a visible semantic section at the bottom of the body." },
              { id: "C", text: "Directly after the closing </html> tag", explanationIfWrong: "Nothing can be written after the closing </html> tag." },
              { id: "D", text: "Inside an HTML comment tag <!-- -->", explanationIfWrong: "Comments are ignored by the browser parser." }
            ],
            correctAnswer: "A",
            explanationNote: "The <head> element is a container for metadata (document title, charset, stylesheets, scripts) and is not directly displayed to the user."
          }
        ]
      },
      {
        heading: "CSS Cascades, Selectors & Specificity",
        text: "CSS defines presentation. Selectors have strict specificity: Inline styles > ID selectors (#id) > Class selectors (.class) > Element tags (div, p).",
        codeSnippet: `p { color: #888; }           /* Element */\n.note { color: #333; }       /* Class (wins over p) */\n#main { color: #00ff9d; }     /* ID (wins over class) */`,
        terminalOutput: `Specificity order: ID > Class > Element`,
        mcq: {
          id: "q-0.2-1-v1",
          question: "In CSS selector specificity rules, which selector has higher specificity than a standard class selector (.container)?",
          options: [
            { id: "A", text: "An ID selector like #main-header", explanationIfWrong: "" },
            { id: "B", text: "An element selector like <div>", explanationIfWrong: "Element selectors have lower specificity than class selectors." },
            { id: "C", text: "The universal selector *", explanationIfWrong: "The universal selector has zero specificity." },
            { id: "D", text: "A descendant element selector like div p", explanationIfWrong: "Two elements have specificity (0, 0, 2), which is lower than a class (0, 1, 0)." }
          ],
          correctAnswer: "A",
          explanationNote: "An ID selector (#id) has a specificity weight of (0, 1, 0, 0), which strictly overrides class selectors (0, 0, 1, 0) and element selectors."
        },
        retestMcq: {
          id: "q-0.2-1-v2",
          question: "What does the acronym 'CSS' stand for in modern web technology?",
          options: [
            { id: "A", text: "Cascading Style Sheets", explanationIfWrong: "" },
            { id: "B", text: "Computer Styling Syntax", explanationIfWrong: "CSS officially stands for Cascading Style Sheets." },
            { id: "C", text: "Creative Sheet System", explanationIfWrong: "CSS stands for Cascading Style Sheets." },
            { id: "D", text: "Client Server Styling", explanationIfWrong: "CSS stands for Cascading Style Sheets." }
          ],
          correctAnswer: "A",
          explanationNote: "CSS stands for Cascading Style Sheets, highlighting the cascading mechanism used to resolve overlapping styling rules."
        },
        questionPool: [
          {
            id: "q-0.2-1-v1",
            question: "In CSS selector specificity rules, which selector has higher specificity than a standard class selector (.container)?",
            options: [
              { id: "A", text: "An ID selector like #main-header", explanationIfWrong: "" },
              { id: "B", text: "An element selector like <div>", explanationIfWrong: "Element selectors have lower specificity than class selectors." },
              { id: "C", text: "The universal selector *", explanationIfWrong: "The universal selector has zero specificity." },
              { id: "D", text: "A descendant element selector like div p", explanationIfWrong: "Two elements have specificity (0, 0, 2), which is lower than a class (0, 1, 0)." }
            ],
            correctAnswer: "A",
            explanationNote: "An ID selector (#id) has a specificity weight of (0, 1, 0, 0), which strictly overrides class selectors (0, 0, 1, 0) and element selectors."
          },
          {
            id: "q-0.2-1-v2",
            question: "What does the acronym 'CSS' stand for in modern web technology?",
            options: [
              { id: "A", text: "Cascading Style Sheets", explanationIfWrong: "" },
              { id: "B", text: "Computer Styling Syntax", explanationIfWrong: "CSS officially stands for Cascading Style Sheets." },
              { id: "C", text: "Creative Sheet System", explanationIfWrong: "CSS stands for Cascading Style Sheets." },
              { id: "D", text: "Client Server Styling", explanationIfWrong: "CSS stands for Cascading Style Sheets." }
            ],
            correctAnswer: "A",
            explanationNote: "CSS stands for Cascading Style Sheets, highlighting the cascading mechanism used to resolve overlapping styling rules."
          }
        ]
      },
      {
        heading: "The Document Object Model (DOM) Tree",
        text: "The browser builds an in-memory tree called the DOM. Each HTML tag is an object node that JavaScript can inspect, add, or modify dynamically.",
        codeSnippet: `// DOM Tree hierarchy:\n// document -> html -> body -> h1, ul`,
        terminalOutput: `document.querySelectorAll('li').length: 2`,
        mcq: {
          id: "q-0.2-2-v1",
          question: "What is the Document Object Model (DOM) in browser architecture?",
          options: [
            { id: "A", text: "An in-memory, object-oriented tree representation of the HTML document that JavaScript can manipulate", explanationIfWrong: "" },
            { id: "B", text: "A physical relational database hosted on the web server", explanationIfWrong: "The DOM is created by the browser inside client memory, not on a server database." },
            { id: "C", text: "A compiler that translates Python into machine bytecode", explanationIfWrong: "The DOM is an HTML document API, not a compiler." },
            { id: "D", text: "An image compression algorithm used by JPEG files", explanationIfWrong: "The DOM represents markup nodes in a webpage." }
          ],
          correctAnswer: "A",
          explanationNote: "The DOM represents an HTML document as a node tree where each node is an object with methods and properties accessible via JavaScript."
        },
        retestMcq: {
          id: "q-0.2-2-v2",
          question: "When you inspect a live webpage in Developer Tools under the 'Elements' tab, what tree structure are you examining?",
          options: [
            { id: "A", text: "The live Document Object Model (DOM) tree constructed by the browser", explanationIfWrong: "" },
            { id: "B", text: "The static unparsed text file on the remote server's hard drive", explanationIfWrong: "The Elements tab displays the live parsed DOM, which includes JavaScript modifications." },
            { id: "C", text: "The CPU registers of the client computer", explanationIfWrong: "The Elements tab displays web document nodes, not CPU registers." },
            { id: "D", text: "The raw binary TCP packet stream", explanationIfWrong: "The Elements tab renders the DOM tree hierarchy." }
          ],
          correctAnswer: "A",
          explanationNote: "The Developer Tools Elements tab displays the live DOM tree as currently held in browser memory, reflecting any dynamic script mutations."
        },
        questionPool: [
          {
            id: "q-0.2-2-v1",
            question: "What is the Document Object Model (DOM) in browser architecture?",
            options: [
              { id: "A", text: "An in-memory, object-oriented tree representation of the HTML document that JavaScript can manipulate", explanationIfWrong: "" },
              { id: "B", text: "A physical relational database hosted on the web server", explanationIfWrong: "The DOM is created by the browser inside client memory, not on a server database." },
              { id: "C", text: "A compiler that translates Python into machine bytecode", explanationIfWrong: "The DOM is an HTML document API, not a compiler." },
              { id: "D", text: "An image compression algorithm used by JPEG files", explanationIfWrong: "The DOM represents markup nodes in a webpage." }
            ],
            correctAnswer: "A",
            explanationNote: "The DOM represents an HTML document as a node tree where each node is an object with methods and properties accessible via JavaScript."
          },
          {
            id: "q-0.2-2-v2",
            question: "When you inspect a live webpage in Developer Tools under the 'Elements' tab, what tree structure are you examining?",
            options: [
              { id: "A", text: "The live Document Object Model (DOM) tree constructed by the browser", explanationIfWrong: "" },
              { id: "B", text: "The static unparsed text file on the remote server's hard drive", explanationIfWrong: "The Elements tab displays the live parsed DOM, which includes JavaScript modifications." },
              { id: "C", text: "The CPU registers of the client computer", explanationIfWrong: "The Elements tab displays web document nodes, not CPU registers." },
              { id: "D", text: "The raw binary TCP packet stream", explanationIfWrong: "The Elements tab renders the DOM tree hierarchy." }
            ],
            correctAnswer: "A",
            explanationNote: "The Developer Tools Elements tab displays the live DOM tree as currently held in browser memory, reflecting any dynamic script mutations."
          }
        ]
      },
      {
        heading: "Linking Stylesheets: External vs Inline Styles",
        text: "External stylesheets linked via <link rel='stylesheet'> keep markup clean and enable browser caching across multiple page visits.",
        codeSnippet: `<head>\n  <link rel="stylesheet" href="/style.css">\n</head>`,
        terminalOutput: `GET /style.css -> 200 OK (Cached)`,
        mcq: {
          id: "q-0.2-3-v1",
          question: "How is an external CSS file correctly linked to an HTML document?",
          options: [
            { id: "A", text: '<link rel="stylesheet" href="style.css" /> inside the <head>', explanationIfWrong: "" },
            { id: "B", text: '<script src="style.css"></script>', explanationIfWrong: "<script> is used for JavaScript files, not CSS stylesheets." },
            { id: "C", text: '<style src="style.css">', explanationIfWrong: "<style> contains inline CSS text, it does not use a src attribute." },
            { id: "D", text: '<css link="style.css" />', explanationIfWrong: "<css> is not a valid HTML tag." }
          ],
          correctAnswer: "A",
          explanationNote: "External stylesheets are linked in the document <head> using the <link rel='stylesheet' href='...'> tag."
        },
        retestMcq: {
          id: "q-0.2-3-v2",
          question: "What is a major advantage of using external stylesheets over inline style attributes?",
          options: [
            { id: "A", text: "Styles can be cached by the browser and shared across multiple pages", explanationIfWrong: "" },
            { id: "B", text: "External stylesheets run faster than compiled C++ code", explanationIfWrong: "CSS is parsed by the browser; comparison to C++ is irrelevant." },
            { id: "C", text: "Inline styles prevent any search engine from reading HTML", explanationIfWrong: "Search engines read HTML regardless of inline styles." },
            { id: "D", text: "External styles can connect directly to SQL databases", explanationIfWrong: "CSS cannot connect to databases; it is strictly a styling language." }
          ],
          correctAnswer: "A",
          explanationNote: "External stylesheets promote separation of concerns, DRY code across multiple pages, and browser caching efficiency."
        },
        questionPool: [
          {
            id: "q-0.2-3-v1",
            question: "How is an external CSS file correctly linked to an HTML document?",
            options: [
              { id: "A", text: '<link rel="stylesheet" href="style.css" /> inside the <head>', explanationIfWrong: "" },
              { id: "B", text: '<script src="style.css"></script>', explanationIfWrong: "<script> is used for JavaScript files, not CSS stylesheets." },
              { id: "C", text: '<style src="style.css">', explanationIfWrong: "<style> contains inline CSS text, it does not use a src attribute." },
              { id: "D", text: '<css link="style.css" />', explanationIfWrong: "<css> is not a valid HTML tag." }
            ],
            correctAnswer: "A",
            explanationNote: "External stylesheets are linked in the document <head> using the <link rel='stylesheet' href='...'> tag."
          },
          {
            id: "q-0.2-3-v2",
            question: "What is a major advantage of using external stylesheets over inline style attributes?",
            options: [
              { id: "A", text: "Styles can be cached by the browser and shared across multiple pages", explanationIfWrong: "" },
              { id: "B", text: "External stylesheets run faster than compiled C++ code", explanationIfWrong: "CSS is parsed by the browser; comparison to C++ is irrelevant." },
              { id: "C", text: "Inline styles prevent any search engine from reading HTML", explanationIfWrong: "Search engines read HTML regardless of inline styles." },
              { id: "D", text: "External styles can connect directly to SQL databases", explanationIfWrong: "CSS cannot connect to databases; it is strictly a styling language." }
            ],
            correctAnswer: "A",
            explanationNote: "External stylesheets promote separation of concerns, DRY code across multiple pages, and browser caching efficiency."
          }
        ]
      },
      {
        heading: "The CSS Box Model",
        text: "Every element is a box with 4 concentric layers: Content (innermost), Padding (inner space), Border (boundary), and Margin (outer clearance).",
        codeSnippet: `* { box-sizing: border-box; }\n.card { padding: 16px; border: 1px solid #00ff9d; margin: 12px; }`,
        terminalOutput: `Box Layers: Content -> Padding -> Border -> Margin`,
        mcq: {
          id: "q-0.2-4-v1",
          question: "In the CSS Box Model, what layer provides transparent inner spacing between the element's content and its border?",
          options: [
            { id: "A", text: "Padding", explanationIfWrong: "" },
            { id: "B", text: "Margin", explanationIfWrong: "Margin is outer spacing beyond the border." },
            { id: "C", text: "Outline", explanationIfWrong: "Outline is drawn outside the border without taking space." },
            { id: "D", text: "Shadow", explanationIfWrong: "Shadow is a visual decoration, not a box model spacing layer." }
          ],
          correctAnswer: "A",
          explanationNote: "Padding clears an area around the content, inside the element's border."
        },
        retestMcq: {
          id: "q-0.2-4-v2",
          question: "In the CSS Box Model, which layer represents the outermost transparent area that separates the element from other elements?",
          options: [
            { id: "A", text: "Margin", explanationIfWrong: "" },
            { id: "B", text: "Padding", explanationIfWrong: "Padding sits inside the border, surrounding content." },
            { id: "C", text: "Border", explanationIfWrong: "Border sits between padding and margin." },
            { id: "D", text: "Content", explanationIfWrong: "Content is the innermost area where text and images appear." }
          ],
          correctAnswer: "A",
          explanationNote: "Margin is the outermost layer of the CSS Box Model that creates space outside the element's border."
        },
        questionPool: [
          {
            id: "q-0.2-4-v1",
            question: "In the CSS Box Model, what layer provides transparent inner spacing between the element's content and its border?",
            options: [
              { id: "A", text: "Padding", explanationIfWrong: "" },
              { id: "B", text: "Margin", explanationIfWrong: "Margin is outer spacing beyond the border." },
              { id: "C", text: "Outline", explanationIfWrong: "Outline is drawn outside the border without taking space." },
              { id: "D", text: "Shadow", explanationIfWrong: "Shadow is a visual decoration, not a box model spacing layer." }
            ],
            correctAnswer: "A",
            explanationNote: "Padding clears an area around the content, inside the element's border."
          },
          {
            id: "q-0.2-4-v2",
            question: "In the CSS Box Model, which layer represents the outermost transparent area that separates the element from other elements?",
            options: [
              { id: "A", text: "Margin", explanationIfWrong: "" },
              { id: "B", text: "Padding", explanationIfWrong: "Padding sits inside the border, surrounding content." },
              { id: "C", text: "Border", explanationIfWrong: "Border sits between padding and margin." },
              { id: "D", text: "Content", explanationIfWrong: "Content is the innermost area where text and images appear." }
            ],
            correctAnswer: "A",
            explanationNote: "Margin is the outermost layer of the CSS Box Model that creates space outside the element's border."
          }
        ]
      },
      {
        heading: "Responsive Design & The Viewport Meta Tag",
        text: "The viewport meta tag instructs mobile browsers to render at device width, while CSS media queries (@media) apply styles conditionally.",
        codeSnippet: `<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n@media (max-width: 768px) {\n  .container { flex-direction: column; }\n}`,
        terminalOutput: `Mobile viewport set to 100% device width`,
        mcq: {
          id: "q-0.2-5-v1",
          question: "Why is the meta tag '<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">' required on modern web pages?",
          options: [
            { id: "A", text: "It instructs mobile browsers to render the page at the device's native screen width rather than zooming out to a desktop canvas", explanationIfWrong: "" },
            { id: "B", text: "It automatically compiles JavaScript into WebAssembly", explanationIfWrong: "The viewport tag configures display sizing, not JavaScript compilation." },
            { id: "C", text: "It encrypts passwords entered into forms", explanationIfWrong: "Security encryption is handled by HTTPS, not a viewport tag." },
            { id: "D", text: "It downloads Google Fonts in the background", explanationIfWrong: "Fonts are loaded via link tags or CSS @import." }
          ],
          correctAnswer: "A",
          explanationNote: "The viewport meta tag tells mobile devices to set the viewport width to the device screen width, ensuring responsive layouts function properly."
        },
        retestMcq: {
          id: "q-0.2-5-v2",
          question: "Which CSS feature allows developers to apply different visual styles depending on screen width, resolution, or orientation?",
          options: [
            { id: "A", text: "CSS Media Queries (@media)", explanationIfWrong: "" },
            { id: "B", text: "CSS Variables (--var)", explanationIfWrong: "Variables store reusable values, but don't evaluate screen conditions alone." },
            { id: "C", text: "CSS Keyframes (@keyframes)", explanationIfWrong: "Keyframes define animation sequences, not screen breakpoints." },
            { id: "D", text: "CSS Imports (@import)", explanationIfWrong: "Imports load external CSS files." }
          ],
          correctAnswer: "A",
          explanationNote: "CSS Media Queries (@media) allow conditional application of styles based on screen parameters like max-width or orientation."
        },
        questionPool: [
          {
            id: "q-0.2-5-v1",
            question: "Why is the meta tag '<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">' required on modern web pages?",
            options: [
              { id: "A", text: "It instructs mobile browsers to render the page at the device's native screen width rather than zooming out to a desktop canvas", explanationIfWrong: "" },
              { id: "B", text: "It automatically compiles JavaScript into WebAssembly", explanationIfWrong: "The viewport tag configures display sizing, not JavaScript compilation." },
              { id: "C", text: "It encrypts passwords entered into forms", explanationIfWrong: "Security encryption is handled by HTTPS, not a viewport tag." },
              { id: "D", text: "It downloads Google Fonts in the background", explanationIfWrong: "Fonts are loaded via link tags or CSS @import." }
            ],
            correctAnswer: "A",
            explanationNote: "The viewport meta tag tells mobile devices to set the viewport width to the device screen width, ensuring responsive layouts function properly."
          },
          {
            id: "q-0.2-5-v2",
            question: "Which CSS feature allows developers to apply different visual styles depending on screen width, resolution, or orientation?",
            options: [
              { id: "A", text: "CSS Media Queries (@media)", explanationIfWrong: "" },
              { id: "B", text: "CSS Variables (--var)", explanationIfWrong: "Variables store reusable values, but don't evaluate screen conditions alone." },
              { id: "C", text: "CSS Keyframes (@keyframes)", explanationIfWrong: "Keyframes define animation sequences, not screen breakpoints." },
              { id: "D", text: "CSS Imports (@import)", explanationIfWrong: "Imports load external CSS files." }
            ],
            correctAnswer: "A",
            explanationNote: "CSS Media Queries (@media) allow conditional application of styles based on screen parameters like max-width or orientation."
          }
        ]
      }
    ]
  },
  {
    id: "0-3-traditional-web-apps",
    number: "0.3",
    title: "Traditional Server-Rendered Web Applications",
    subtitle: "Understand classic web page architectures, server-side template rendering, full page reload cycles, and resource waterfalls.",
    readTime: "15 min",
    objectives: [
      "Understand how traditional multi-page web applications function",
      "Explain Server-Side Rendering (SSR) and template interpolation",
      "Analyze the full page reload lifecycle and its user experience impacts",
      "Understand the resource loading waterfall and browser parser blocking",
      "Evaluate server computational load in traditional server-rendered apps",
      "Walk through the University of Helsinki traditional Notes app implementation"
    ],
    theoryBlocks: [
      {
        heading: "How Traditional Web Applications Work",
        text: "In a traditional web application, the backend server generates the complete HTML document dynamically for each page request.",
        codeSnippet: `// Server constructs HTML:\nres.send('<html><body><h1>All Notes</h1></body></html>');`,
        terminalOutput: `Server returns full HTML document`,
        mcq: {
          id: "q-0.3-0-v1",
          question: "In a traditional server-rendered web application, which component generates the complete HTML document shown to the user?",
          options: [
            { id: "A", text: "The backend server on each request", explanationIfWrong: "" },
            { id: "B", text: "The client browser's JavaScript engine exclusively", explanationIfWrong: "In traditional apps, the server creates the HTML before sending it to the client." },
            { id: "C", text: "The user's local operating system kernel", explanationIfWrong: "The OS kernel does not render HTML markup." },
            { id: "D", text: "The domain name registrar (DNS)", explanationIfWrong: "DNS only resolves domain names to IP addresses." }
          ],
          correctAnswer: "A",
          explanationNote: "In traditional web architecture, the backend server processes data and renders complete HTML pages before transmitting them to the client."
        },
        retestMcq: {
          id: "q-0.3-0-v2",
          question: "What occurs in a traditional multi-page web application when the user clicks a link to navigate to another page?",
          options: [
            { id: "A", text: "The browser discards the current page and executes a full page reload for the new HTML document", explanationIfWrong: "" },
            { id: "B", text: "Only raw JSON is fetched while the HTML page remains untouched", explanationIfWrong: "That is the behavior of Single Page Applications (SPAs), not traditional apps." },
            { id: "C", text: "The browser operates completely offline without network requests", explanationIfWrong: "Navigation triggers a network GET request to the server." },
            { id: "D", text: "The browser restarts the operating system", explanationIfWrong: "Page navigation is confined to the browser tab." }
          ],
          correctAnswer: "A",
          explanationNote: "Traditional web apps perform full page reloads: the browser requests a new HTML document, discarding the previous DOM state entirely."
        },
        questionPool: [
          {
            id: "q-0.3-0-v1",
            question: "In a traditional server-rendered web application, which component generates the complete HTML document shown to the user?",
            options: [
              { id: "A", text: "The backend server on each request", explanationIfWrong: "" },
              { id: "B", text: "The client browser's JavaScript engine exclusively", explanationIfWrong: "In traditional apps, the server creates the HTML before sending it to the client." },
              { id: "C", text: "The user's local operating system kernel", explanationIfWrong: "The OS kernel does not render HTML markup." },
              { id: "D", text: "The domain name registrar (DNS)", explanationIfWrong: "DNS only resolves domain names to IP addresses." }
            ],
            correctAnswer: "A",
            explanationNote: "In traditional web architecture, the backend server processes data and renders complete HTML pages before transmitting them to the client."
          },
          {
            id: "q-0.3-0-v2",
            question: "What occurs in a traditional multi-page web application when the user clicks a link to navigate to another page?",
            options: [
              { id: "A", text: "The browser discards the current page and executes a full page reload for the new HTML document", explanationIfWrong: "" },
              { id: "B", text: "Only raw JSON is fetched while the HTML page remains untouched", explanationIfWrong: "That is the behavior of Single Page Applications (SPAs), not traditional apps." },
              { id: "C", text: "The browser operates completely offline without network requests", explanationIfWrong: "Navigation triggers a network GET request to the server." },
              { id: "D", text: "The browser restarts the operating system", explanationIfWrong: "Page navigation is confined to the browser tab." }
            ],
            correctAnswer: "A",
            explanationNote: "Traditional web apps perform full page reloads: the browser requests a new HTML document, discarding the previous DOM state entirely."
          }
        ]
      },
      {
        heading: "Server-Side Rendering (SSR) & Dynamic Templates",
        text: "Template engines (like EJS or Jinja) merge database data into an HTML template on the server. The browser receives finished static HTML.",
        codeSnippet: `<!-- EJS template rendered on server -->\n<ul><% notes.forEach(n => { %><li><%= n.content %></li><% }); %></ul>`,
        terminalOutput: `Server renders: <ul><li>HTML is easy</li></ul>`,
        mcq: {
          id: "q-0.3-1-v1",
          question: "How do traditional server template engines (e.g., EJS, Jinja2, Blade) embed database records into web pages?",
          options: [
            { id: "A", text: "By executing template interpolation on the server and sending pre-rendered HTML to the browser", explanationIfWrong: "" },
            { id: "B", text: "By downloading the entire SQL database into the browser's localStorage", explanationIfWrong: "Databases remain protected on the backend; browsers never download raw SQL tables." },
            { id: "C", text: "By asking the user to manually type the HTML tags into an alert prompt", explanationIfWrong: "Template engines automate HTML generation programmatically." },
            { id: "D", text: "By sending raw C++ source code to the client", explanationIfWrong: "Web servers transmit standard HTML/CSS/JS text." }
          ],
          correctAnswer: "A",
          explanationNote: "Template engines execute on the server, populating HTML template variables with database records before transmitting the finished HTML."
        },
        retestMcq: {
          id: "q-0.3-1-v2",
          question: "Which component executes the template interpolation logic in a classic server-rendered web application?",
          options: [
            { id: "A", text: "The backend server environment before sending the HTTP response", explanationIfWrong: "" },
            { id: "B", text: "The client GPU", explanationIfWrong: "The GPU renders pixels, it does not evaluate server templates." },
            { id: "C", text: "The visitor's home Wi-Fi router", explanationIfWrong: "Routers forward packets and do not parse template logic." },
            { id: "D", text: "The browser's WebAssembly runtime", explanationIfWrong: "SSR templates are executed on the server, not in client WebAssembly." }
          ],
          correctAnswer: "A",
          explanationNote: "In classic SSR, all template compilation and HTML generation occurs on the backend server."
        },
        questionPool: [
          {
            id: "q-0.3-1-v1",
            question: "How do traditional server template engines (e.g., EJS, Jinja2, Blade) embed database records into web pages?",
            options: [
              { id: "A", text: "By executing template interpolation on the server and sending pre-rendered HTML to the browser", explanationIfWrong: "" },
              { id: "B", text: "By downloading the entire SQL database into the browser's localStorage", explanationIfWrong: "Databases remain protected on the backend; browsers never download raw SQL tables." },
              { id: "C", text: "By asking the user to manually type the HTML tags into an alert prompt", explanationIfWrong: "Template engines automate HTML generation programmatically." },
              { id: "D", text: "By sending raw C++ source code to the client", explanationIfWrong: "Web servers transmit standard HTML/CSS/JS text." }
            ],
            correctAnswer: "A",
            explanationNote: "Template engines execute on the server, populating HTML template variables with database records before transmitting the finished HTML."
          },
          {
            id: "q-0.3-1-v2",
            question: "Which component executes the template interpolation logic in a classic server-rendered web application?",
            options: [
              { id: "A", text: "The backend server environment before sending the HTTP response", explanationIfWrong: "" },
              { id: "B", text: "The client GPU", explanationIfWrong: "The GPU renders pixels, it does not evaluate server templates." },
              { id: "C", text: "The visitor's home Wi-Fi router", explanationIfWrong: "Routers forward packets and do not parse template logic." },
              { id: "D", text: "The browser's WebAssembly runtime", explanationIfWrong: "SSR templates are executed on the server, not in client WebAssembly." }
            ],
            correctAnswer: "A",
            explanationNote: "In classic SSR, all template compilation and HTML generation occurs on the backend server."
          }
        ]
      },
      {
        heading: "The Post/Redirect/Get (PRG) Pattern",
        text: "When a form is submitted via POST, the server saves the record and redirects with HTTP 302 to prevent duplicate submissions on page refresh.",
        codeSnippet: `// Post/Redirect/Get flow:\n// POST /new_note -> 302 Redirect (Location: /notes) -> GET /notes`,
        terminalOutput: `302 Found -> Browser reloads /notes`,
        mcq: {
          id: "q-0.3-2-v1",
          question: "In traditional web applications, what HTTP status code does the server typically return after a successful POST submission to implement the Post/Redirect/Get pattern?",
          options: [
            { id: "A", text: "302 Found (or 303 See Other) Redirect", explanationIfWrong: "" },
            { id: "B", text: "500 Internal Error", explanationIfWrong: "500 represents a server crash, not a redirect." },
            { id: "C", text: "404 Not Found", explanationIfWrong: "404 indicates a missing resource." },
            { id: "D", text: "401 Unauthorized", explanationIfWrong: "401 indicates lack of authentication." }
          ],
          correctAnswer: "A",
          explanationNote: "The Post/Redirect/Get pattern uses a 302 Found or 303 See Other redirect status to instruct the browser to issue a GET request to the target URL."
        },
        retestMcq: {
          id: "q-0.3-2-v2",
          question: "What primary user experience issue does the Post/Redirect/Get pattern solve in classic web apps?",
          options: [
            { id: "A", text: "It prevents duplicate form submissions if the user reloads the browser page", explanationIfWrong: "" },
            { id: "B", text: "It automatically increases the user's internet bandwidth", explanationIfWrong: "HTTP status codes cannot modify network bandwidth." },
            { id: "C", text: "It converts HTML into Python script automatically", explanationIfWrong: "PRG pattern is a navigation pattern, not a language converter." },
            { id: "D", text: "It permanently closes the user's browser tab", explanationIfWrong: "PRG navigates the user to the updated page." }
          ],
          correctAnswer: "A",
          explanationNote: "Redirecting after POST prevents duplicate form submissions when the user clicks the browser reload button."
        },
        questionPool: [
          {
            id: "q-0.3-2-v1",
            question: "In traditional web applications, what HTTP status code does the server typically return after a successful POST submission to implement the Post/Redirect/Get pattern?",
            options: [
              { id: "A", text: "302 Found (or 303 See Other) Redirect", explanationIfWrong: "" },
              { id: "B", text: "500 Internal Error", explanationIfWrong: "500 represents a server crash, not a redirect." },
              { id: "C", text: "404 Not Found", explanationIfWrong: "404 indicates a missing resource." },
              { id: "D", text: "401 Unauthorized", explanationIfWrong: "401 indicates lack of authentication." }
            ],
            correctAnswer: "A",
            explanationNote: "The Post/Redirect/Get pattern uses a 302 Found or 303 See Other redirect status to instruct the browser to issue a GET request to the target URL."
          },
          {
            id: "q-0.3-2-v2",
            question: "What primary user experience issue does the Post/Redirect/Get pattern solve in classic web apps?",
            options: [
              { id: "A", text: "It prevents duplicate form submissions if the user reloads the browser page", explanationIfWrong: "" },
              { id: "B", text: "It automatically increases the user's internet bandwidth", explanationIfWrong: "HTTP status codes cannot modify network bandwidth." },
              { id: "C", text: "It converts HTML into Python script automatically", explanationIfWrong: "PRG pattern is a navigation pattern, not a language converter." },
              { id: "D", text: "It permanently closes the user's browser tab", explanationIfWrong: "PRG navigates the user to the updated page." }
            ],
            correctAnswer: "A",
            explanationNote: "Redirecting after POST prevents duplicate form submissions when the user clicks the browser reload button."
          }
        ]
      },
      {
        heading: "Resource Loading Waterfall & Sequential Assets",
        text: "The browser downloads HTML first, then parses external links to issue subsequent requests for stylesheets, scripts, and images in a waterfall.",
        codeSnippet: `<!-- Parsing triggers new requests -->\n<link rel="stylesheet" href="/style.css">\n<script src="/app.js"></script>`,
        terminalOutput: `Waterfall: HTML (0ms) -> CSS (30ms) -> JS (40ms)`,
        mcq: {
          id: "q-0.3-3-v1",
          question: "When a browser parses an HTML document containing '<link rel=\"stylesheet\" href=\"style.css\">', what action does it take?",
          options: [
            { id: "A", text: "It issues a separate HTTP GET request to download style.css", explanationIfWrong: "" },
            { id: "B", text: "It immediately terminates the web session", explanationIfWrong: "External resource tags prompt downloads, not termination." },
            { id: "C", text: "It deletes the HTML file from client storage", explanationIfWrong: "Linking external files downloads the asset." },
            { id: "D", text: "It compiles the CSS code into binary machine code", explanationIfWrong: "CSS is parsed by the browser layout engine." }
          ],
          correctAnswer: "A",
          explanationNote: "When discovering external asset tags like <link> or <script>, the browser sends dedicated HTTP GET requests to fetch each resource."
        },
        retestMcq: {
          id: "q-0.3-3-v2",
          question: "In a network waterfall diagram, why do CSS and JavaScript asset requests always begin after the initial HTML document request?",
          options: [
            { id: "A", text: "Because the browser must first download and parse the HTML to discover the asset references inside it", explanationIfWrong: "" },
            { id: "B", text: "Because CSS files can only be downloaded between 12:00 and 1:00 PM", explanationIfWrong: "Network requests occur whenever instructed by page parsing." },
            { id: "C", text: "Because servers are forbidden from serving CSS on weekdays", explanationIfWrong: "HTTP servers serve requested assets at any time." },
            { id: "D", text: "Because web browsers must reboot before downloading CSS", explanationIfWrong: "Browsers download assets in the active rendering pipeline." }
          ],
          correctAnswer: "A",
          explanationNote: "The browser only learns that stylesheet or script files exist once it parses the initial HTML document containing the <link> and <script> tags."
        },
        questionPool: [
          {
            id: "q-0.3-3-v1",
            question: "When a browser parses an HTML document containing '<link rel=\"stylesheet\" href=\"style.css\">', what action does it take?",
            options: [
              { id: "A", text: "It issues a separate HTTP GET request to download style.css", explanationIfWrong: "" },
              { id: "B", text: "It immediately terminates the web session", explanationIfWrong: "External resource tags prompt downloads, not termination." },
              { id: "C", text: "It deletes the HTML file from client storage", explanationIfWrong: "Linking external files downloads the asset." },
              { id: "D", text: "It compiles the CSS code into binary machine code", explanationIfWrong: "CSS is parsed by the browser layout engine." }
            ],
            correctAnswer: "A",
            explanationNote: "When discovering external asset tags like <link> or <script>, the browser sends dedicated HTTP GET requests to fetch each resource."
          },
          {
            id: "q-0.3-3-v2",
            question: "In a network waterfall diagram, why do CSS and JavaScript asset requests always begin after the initial HTML document request?",
            options: [
              { id: "A", text: "Because the browser must first download and parse the HTML to discover the asset references inside it", explanationIfWrong: "" },
              { id: "B", text: "Because CSS files can only be downloaded between 12:00 and 1:00 PM", explanationIfWrong: "Network requests occur whenever instructed by page parsing." },
              { id: "C", text: "Because servers are forbidden from serving CSS on weekdays", explanationIfWrong: "HTTP servers serve requested assets at any time." },
              { id: "D", text: "Because web browsers must reboot before downloading CSS", explanationIfWrong: "Browsers download assets in the active rendering pipeline." }
            ],
            correctAnswer: "A",
            explanationNote: "The browser only learns that stylesheet or script files exist once it parses the initial HTML document containing the <link> and <script> tags."
          }
        ]
      },
      {
        heading: "Server Load & Scalability in Traditional SSR",
        text: "Building HTML on every request requires significant server CPU under load. Modern architectures offload UI rendering to the client browser.",
        codeSnippet: `// Traditional: Server renders 20KB HTML\n// Modern API: Server returns 1KB JSON`,
        terminalOutput: `JSON transfer uses 95% less bandwidth`,
        mcq: {
          id: "q-0.3-4-v1",
          question: "Why does traditional server-side rendering place a heavier computational burden on backend servers compared to client-rendered SPAs?",
          options: [
            { id: "A", text: "The server must execute template logic and construct full HTML documents for every single page request from every user", explanationIfWrong: "" },
            { id: "B", text: "The server must compile Java into machine code for each user", explanationIfWrong: "Template rendering is HTML generation, not Java compilation." },
            { id: "C", text: "HTML files require special liquid helium cooling to transmit", explanationIfWrong: "HTML is standard text transmitted over TCP." },
            { id: "D", text: "Web servers cannot use caching under any circumstances", explanationIfWrong: "Web servers can cache, but dynamic SSR requires fresh rendering." }
          ],
          correctAnswer: "A",
          explanationNote: "In traditional SSR, the server must compute database queries and interpolate complete HTML string trees for every page view, requiring significant server CPU resources."
        },
        retestMcq: {
          id: "q-0.3-4-v2",
          question: "What is an undeniable advantage that traditional server-rendered HTML holds over purely client-rendered single page applications?",
          options: [
            { id: "A", text: "Immediate search engine crawlability and instant initial paint of content without needing client JavaScript execution", explanationIfWrong: "" },
            { id: "B", text: "Immunity to all internet network disconnects", explanationIfWrong: "Traditional apps require active network connections for all navigations." },
            { id: "C", text: "Zero memory usage on both client and server", explanationIfWrong: "Both client and server consume memory to display web pages." },
            { id: "D", text: "Automatic creation of native mobile iOS and Android apps", explanationIfWrong: "SSR generates HTML for web browsers, not native mobile binary apps." }
          ],
          correctAnswer: "A",
          explanationNote: "Because traditional SSR sends fully formed HTML directly in the first response, search engines can index content immediately and users see text without waiting for JavaScript execution."
        },
        questionPool: [
          {
            id: "q-0.3-4-v1",
            question: "Why does traditional server-side rendering place a heavier computational burden on backend servers compared to client-rendered SPAs?",
            options: [
              { id: "A", text: "The server must execute template logic and construct full HTML documents for every single page request from every user", explanationIfWrong: "" },
              { id: "B", text: "The server must compile Java into machine code for each user", explanationIfWrong: "Template rendering is HTML generation, not Java compilation." },
              { id: "C", text: "HTML files require special liquid helium cooling to transmit", explanationIfWrong: "HTML is standard text transmitted over TCP." },
              { id: "D", text: "Web servers cannot use caching under any circumstances", explanationIfWrong: "Web servers can cache, but dynamic SSR requires fresh rendering." }
            ],
            correctAnswer: "A",
            explanationNote: "In traditional SSR, the server must compute database queries and interpolate complete HTML string trees for every page view, requiring significant server CPU resources."
          },
          {
            id: "q-0.3-4-v2",
            question: "What is an undeniable advantage that traditional server-rendered HTML holds over purely client-rendered single page applications?",
            options: [
              { id: "A", text: "Immediate search engine crawlability and instant initial paint of content without needing client JavaScript execution", explanationIfWrong: "" },
              { id: "B", text: "Immunity to all internet network disconnects", explanationIfWrong: "Traditional apps require active network connections for all navigations." },
              { id: "C", text: "Zero memory usage on both client and server", explanationIfWrong: "Both client and server consume memory to display web pages." },
              { id: "D", text: "Automatic creation of native mobile iOS and Android apps", explanationIfWrong: "SSR generates HTML for web browsers, not native mobile binary apps." }
            ],
            correctAnswer: "A",
            explanationNote: "Because traditional SSR sends fully formed HTML directly in the first response, search engines can index content immediately and users see text without waiting for JavaScript execution."
          }
        ]
      },
      {
        heading: "University of Helsinki Notes App (Traditional Mode)",
        text: "In the Helsinki traditional example, the browser requests the HTML skeleton, fetches data.json via script, and reloads the full page on submission.",
        codeSnippet: `// 1. GET /exampleapp/notes\n// 2. GET /exampleapp/data.json\n// 3. POST /exampleapp/new_note -> 302 Redirect`,
        terminalOutput: `POST note -> 302 Redirect -> Reload page`,
        mcq: {
          id: "q-0.3-5-v1",
          question: "In the University of Helsinki Part 0 Notes application, how are the actual note items fetched and displayed on the initial page load?",
          options: [
            { id: "A", text: "The browser executes main.js, which requests data.json from the server and dynamically appends <li> elements into the DOM", explanationIfWrong: "" },
            { id: "B", text: "The notes are hard-coded into the operating system firmware", explanationIfWrong: "Notes are fetched over the network from the server." },
            { id: "C", text: "The browser connects via Bluetooth to a nearby printer", explanationIfWrong: "The application communicates with a web server over HTTP." },
            { id: "D", text: "The server sends an MP3 audio recording of the notes", explanationIfWrong: "Data is transmitted in JSON format." }
          ],
          correctAnswer: "A",
          explanationNote: "In the Helsinki exampleapp/notes, the JavaScript file main.js fetches data.json from the server and programmatically constructs DOM list elements."
        },
        retestMcq: {
          id: "q-0.3-5-v2",
          question: "When a user types a new note and clicks Save in the Helsinki traditional Notes app, how does the page update?",
          options: [
            { id: "A", text: "The form sends a standard POST request, the server redirects with 302, and the browser reloads the entire page from scratch", explanationIfWrong: "" },
            { id: "B", text: "The browser instantly saves the note locally and never contacts the server", explanationIfWrong: "The note is sent to the server to persist in database/memory." },
            { id: "C", text: "The browser deletes all previous notes from history", explanationIfWrong: "Previous notes are preserved and re-rendered." },
            { id: "D", text: "The user must reinstall the web browser to see the update", explanationIfWrong: "A simple page reload fetches the updated list." }
          ],
          correctAnswer: "A",
          explanationNote: "The traditional notes application uses standard HTML form submission, causing a POST request, a 302 redirect, and a full page reload."
        },
        questionPool: [
          {
            id: "q-0.3-5-v1",
            question: "In the University of Helsinki Part 0 Notes application, how are the actual note items fetched and displayed on the initial page load?",
            options: [
              { id: "A", text: "The browser executes main.js, which requests data.json from the server and dynamically appends <li> elements into the DOM", explanationIfWrong: "" },
              { id: "B", text: "The notes are hard-coded into the operating system firmware", explanationIfWrong: "Notes are fetched over the network from the server." },
              { id: "C", text: "The browser connects via Bluetooth to a nearby printer", explanationIfWrong: "The application communicates with a web server over HTTP." },
              { id: "D", text: "The server sends an MP3 audio recording of the notes", explanationIfWrong: "Data is transmitted in JSON format." }
            ],
            correctAnswer: "A",
            explanationNote: "In the Helsinki exampleapp/notes, the JavaScript file main.js fetches data.json from the server and programmatically constructs DOM list elements."
          },
          {
            id: "q-0.3-5-v2",
            question: "When a user types a new note and clicks Save in the Helsinki traditional Notes app, how does the page update?",
            options: [
              { id: "A", text: "The form sends a standard POST request, the server redirects with 302, and the browser reloads the entire page from scratch", explanationIfWrong: "" },
              { id: "B", text: "The browser instantly saves the note locally and never contacts the server", explanationIfWrong: "The note is sent to the server to persist in database/memory." },
              { id: "C", text: "The browser deletes all previous notes from history", explanationIfWrong: "Previous notes are preserved and re-rendered." },
              { id: "D", text: "The user must reinstall the web browser to see the update", explanationIfWrong: "A simple page reload fetches the updated list." }
            ],
            correctAnswer: "A",
            explanationNote: "The traditional notes application uses standard HTML form submission, causing a POST request, a 302 redirect, and a full page reload."
          }
        ]
      }
    ]
  },
  {
    id: "0-4-browser-js-event-loop",
    number: "0.4",
    title: "Browser JavaScript, Event Loops & Callbacks",
    subtitle: "Master client-side script execution, the global window/document objects, dynamic DOM manipulation, event listeners, and asynchronous callbacks.",
    readTime: "15 min",
    objectives: [
      "Understand how the browser executes client-side JavaScript",
      "Navigate the global 'window' and 'document' objects",
      "Create, modify, and append DOM elements dynamically in JavaScript",
      "Attach event listeners and handle user interactions (clicks, form submits)",
      "Explain the single-threaded JavaScript Event Loop and Callback Queue",
      "Understand asynchronous HTTP fetching with XMLHttpRequest and modern fetch()"
    ],
    theoryBlocks: [
      {
        heading: "Executing JavaScript in the Browser",
        text: "JavaScript executes inside the browser's JavaScript engine (e.g. Chrome V8) to manipulate the page and respond to user actions.",
        codeSnippet: `console.log("JavaScript running on client!");`,
        terminalOutput: `JavaScript running on client!`,
        mcq: {
          id: "q-0.4-0-v1",
          question: "Where is client-side JavaScript executed when a user visits a website?",
          options: [
            { id: "A", text: "In the browser's JavaScript engine (e.g. V8) on the user's client device", explanationIfWrong: "" },
            { id: "B", text: "Exclusively on the server's hard drive before sending data", explanationIfWrong: "Browser JavaScript executes on the client device." },
            { id: "C", text: "Inside the DNS domain name server", explanationIfWrong: "DNS does not execute client JavaScript." },
            { id: "D", text: "In the user's graphic monitor firmware", explanationIfWrong: "Monitors display video signals; JavaScript runs in the browser engine." }
          ],
          correctAnswer: "A",
          explanationNote: "Client-side JavaScript is executed locally on the user's computer inside the browser's built-in JavaScript engine (such as Chrome V8)."
        },
        retestMcq: {
          id: "q-0.4-0-v2",
          question: "Which HTML tag is used to reference an external JavaScript file or embed inline JavaScript into a webpage?",
          options: [
            { id: "A", text: "<script>", explanationIfWrong: "" },
            { id: "B", text: "<javascript>", explanationIfWrong: "<javascript> is not a valid HTML element." },
            { id: "C", text: "<code>", explanationIfWrong: "<code> is a semantic tag to format code text, it does not execute scripts." },
            { id: "D", text: "<link rel='javascript'>", explanationIfWrong: "<link> is for stylesheets, icons, and preloading, not script execution." }
          ],
          correctAnswer: "A",
          explanationNote: "The HTML <script> tag is the standard element used to embed or load executable JavaScript code."
        },
        questionPool: [
          {
            id: "q-0.4-0-v1",
            question: "Where is client-side JavaScript executed when a user visits a website?",
            options: [
              { id: "A", text: "In the browser's JavaScript engine (e.g. V8) on the user's client device", explanationIfWrong: "" },
              { id: "B", text: "Exclusively on the server's hard drive before sending data", explanationIfWrong: "Browser JavaScript executes on the client device." },
              { id: "C", text: "Inside the DNS domain name server", explanationIfWrong: "DNS does not execute client JavaScript." },
              { id: "D", text: "In the user's graphic monitor firmware", explanationIfWrong: "Monitors display video signals; JavaScript runs in the browser engine." }
            ],
            correctAnswer: "A",
            explanationNote: "Client-side JavaScript is executed locally on the user's computer inside the browser's built-in JavaScript engine (such as Chrome V8)."
          },
          {
            id: "q-0.4-0-v2",
            question: "Which HTML tag is used to reference an external JavaScript file or embed inline JavaScript into a webpage?",
            options: [
              { id: "A", text: "<script>", explanationIfWrong: "" },
              { id: "B", text: "<javascript>", explanationIfWrong: "<javascript> is not a valid HTML element." },
              { id: "C", text: "<code>", explanationIfWrong: "<code> is a semantic tag to format code text, it does not execute scripts." },
              { id: "D", text: "<link rel='javascript'>", explanationIfWrong: "<link> is for stylesheets, icons, and preloading, not script execution." }
            ],
            correctAnswer: "A",
            explanationNote: "The HTML <script> tag is the standard element used to embed or load executable JavaScript code."
          }
        ]
      },
      {
        heading: "The Global 'window' and 'document' Objects",
        text: "The global 'window' represents the browser tab, while 'document' serves as the root gateway for inspecting and modifying page elements.",
        codeSnippet: `console.log(window.innerWidth);\nconst heading = document.getElementById('title');`,
        terminalOutput: `Window innerWidth: 1440`,
        mcq: {
          id: "q-0.4-1-v1",
          question: "Which global JavaScript object in web browsers represents the loaded HTML page and provides methods like getElementById?",
          options: [
            { id: "A", text: "document", explanationIfWrong: "" },
            { id: "B", text: "process", explanationIfWrong: "process is a global object in Node.js, not the browser DOM." },
            { id: "C", text: "database", explanationIfWrong: "database is not a native browser global object." },
            { id: "D", text: "console.render", explanationIfWrong: "console is for logging, not DOM tree manipulation." }
          ],
          correctAnswer: "A",
          explanationNote: "The 'document' object serves as the entry point into the web page's DOM tree content."
        },
        retestMcq: {
          id: "q-0.4-1-v2",
          question: "What is the topmost global scope object in browser JavaScript that represents the browser window or tab?",
          options: [
            { id: "A", text: "window", explanationIfWrong: "" },
            { id: "B", text: "globalThis.server", explanationIfWrong: "Browsers have window as their primary global object." },
            { id: "C", text: "htmlContainer", explanationIfWrong: "htmlContainer is not a native JavaScript global." },
            { id: "D", text: "screenBuffer", explanationIfWrong: "screenBuffer is not a standard global object." }
          ],
          correctAnswer: "A",
          explanationNote: "In client-side JavaScript, the 'window' object represents the global execution environment of the browser tab."
        },
        questionPool: [
          {
            id: "q-0.4-1-v1",
            question: "Which global JavaScript object in web browsers represents the loaded HTML page and provides methods like getElementById?",
            options: [
              { id: "A", text: "document", explanationIfWrong: "" },
              { id: "B", text: "process", explanationIfWrong: "process is a global object in Node.js, not the browser DOM." },
              { id: "C", text: "database", explanationIfWrong: "database is not a native browser global object." },
              { id: "D", text: "console.render", explanationIfWrong: "console is for logging, not DOM tree manipulation." }
            ],
            correctAnswer: "A",
            explanationNote: "The 'document' object serves as the entry point into the web page's DOM tree content."
          },
          {
            id: "q-0.4-1-v2",
            question: "What is the topmost global scope object in browser JavaScript that represents the browser window or tab?",
            options: [
              { id: "A", text: "window", explanationIfWrong: "" },
              { id: "B", text: "globalThis.server", explanationIfWrong: "Browsers have window as their primary global object." },
              { id: "C", text: "htmlContainer", explanationIfWrong: "htmlContainer is not a native JavaScript global." },
              { id: "D", text: "screenBuffer", explanationIfWrong: "screenBuffer is not a standard global object." }
            ],
            correctAnswer: "A",
            explanationNote: "In client-side JavaScript, the 'window' object represents the global execution environment of the browser tab."
          }
        ]
      },
      {
        heading: "Manipulating the DOM with JavaScript",
        text: "JavaScript creates new elements with document.createElement() and appends them to parent elements with parent.appendChild().",
        codeSnippet: `const li = document.createElement('li');\nli.textContent = "New Note";\nul.appendChild(li);`,
        terminalOutput: `Appended <li> to <ul>`,
        mcq: {
          id: "q-0.4-2-v1",
          question: "Which JavaScript document method is used to programmatically create a brand new HTML element node?",
          options: [
            { id: "A", text: "document.createElement('tagName')", explanationIfWrong: "" },
            { id: "B", text: "document.makeTag('tagName')", explanationIfWrong: "makeTag is not a standard DOM API method." },
            { id: "C", text: "document.newHtml('tagName')", explanationIfWrong: "newHtml is not a DOM method." },
            { id: "D", text: "window.insertNode('tagName')", explanationIfWrong: "DOM element creation is handled by document.createElement." }
          ],
          correctAnswer: "A",
          explanationNote: "document.createElement(tagName) creates the HTML element specified by tagName in browser memory."
        },
        retestMcq: {
          id: "q-0.4-2-v2",
          question: "How do you insert a newly created DOM element node as the last child of an existing parent element?",
          options: [
            { id: "A", text: "parentElement.appendChild(newElement)", explanationIfWrong: "" },
            { id: "B", text: "parentElement.push(newElement)", explanationIfWrong: "push is an Array method, not a DOM Node method." },
            { id: "C", text: "parentElement.attachHtml(newElement)", explanationIfWrong: "attachHtml is not a standard DOM method." },
            { id: "D", text: "document.writeChild(newElement)", explanationIfWrong: "document.writeChild does not exist." }
          ],
          correctAnswer: "A",
          explanationNote: "parentElement.appendChild(node) adds a node to the end of the list of children of a specified parent node."
        },
        questionPool: [
          {
            id: "q-0.4-2-v1",
            question: "Which JavaScript document method is used to programmatically create a brand new HTML element node?",
            options: [
              { id: "A", text: "document.createElement('tagName')", explanationIfWrong: "" },
              { id: "B", text: "document.makeTag('tagName')", explanationIfWrong: "makeTag is not a standard DOM API method." },
              { id: "C", text: "document.newHtml('tagName')", explanationIfWrong: "newHtml is not a DOM method." },
              { id: "D", text: "window.insertNode('tagName')", explanationIfWrong: "DOM element creation is handled by document.createElement." }
            ],
            correctAnswer: "A",
            explanationNote: "document.createElement(tagName) creates the HTML element specified by tagName in browser memory."
          },
          {
            id: "q-0.4-2-v2",
            question: "How do you insert a newly created DOM element node as the last child of an existing parent element?",
            options: [
              { id: "A", text: "parentElement.appendChild(newElement)", explanationIfWrong: "" },
              { id: "B", text: "parentElement.push(newElement)", explanationIfWrong: "push is an Array method, not a DOM Node method." },
              { id: "C", text: "parentElement.attachHtml(newElement)", explanationIfWrong: "attachHtml is not a standard DOM method." },
              { id: "D", text: "document.writeChild(newElement)", explanationIfWrong: "document.writeChild does not exist." }
            ],
            correctAnswer: "A",
            explanationNote: "parentElement.appendChild(node) adds a node to the end of the list of children of a specified parent node."
          }
        ]
      },
      {
        heading: "Event Listeners & Interactive User Actions",
        text: "Web pages are event-driven. Use addEventListener() to register callback functions triggered when users click, type, or submit forms.",
        codeSnippet: `const btn = document.querySelector('button');\nbtn.addEventListener('click', (e) => {\n  console.log('Button clicked!');\n});`,
        terminalOutput: `Event: 'click' fired`,
        mcq: {
          id: "q-0.4-3-v1",
          question: "Which method is the modern standard for attaching an event handler (such as a click listener) to a DOM button element?",
          options: [
            { id: "A", text: "button.addEventListener('click', handlerFunction)", explanationIfWrong: "" },
            { id: "B", text: "button.attachTrigger('click', handlerFunction)", explanationIfWrong: "attachTrigger is not a DOM method." },
            { id: "C", text: "document.bindEvent('click', button)", explanationIfWrong: "bindEvent is not a native DOM method." },
            { id: "D", text: "button.listen('click')", explanationIfWrong: "listen is not a DOM method." }
          ],
          correctAnswer: "A",
          explanationNote: "The addEventListener() method sets up a function that will be called whenever the specified event is delivered to the target."
        },
        retestMcq: {
          id: "q-0.4-3-v2",
          question: "What parameter is automatically passed by the browser to an event handler callback function when an event fires?",
          options: [
            { id: "A", text: "An Event object containing metadata about the interaction (e.g., target, coordinates)", explanationIfWrong: "" },
            { id: "B", text: "The entire server source code", explanationIfWrong: "Event handlers do not receive server source code." },
            { id: "C", text: "The user's credit card number", explanationIfWrong: "Event objects do not contain private billing data." },
            { id: "D", text: "A binary JPEG screenshot of the desktop", explanationIfWrong: "The Event object contains interaction properties, not image files." }
          ],
          correctAnswer: "A",
          explanationNote: "The browser automatically passes an Event object (commonly named 'e' or 'event') to the handler function with details about the event."
        },
        questionPool: [
          {
            id: "q-0.4-3-v1",
            question: "Which method is the modern standard for attaching an event handler (such as a click listener) to a DOM button element?",
            options: [
              { id: "A", text: "button.addEventListener('click', handlerFunction)", explanationIfWrong: "" },
              { id: "B", text: "button.attachTrigger('click', handlerFunction)", explanationIfWrong: "attachTrigger is not a DOM method." },
              { id: "C", text: "document.bindEvent('click', button)", explanationIfWrong: "bindEvent is not a native DOM method." },
              { id: "D", text: "button.listen('click')", explanationIfWrong: "listen is not a DOM method." }
            ],
            correctAnswer: "A",
            explanationNote: "The addEventListener() method sets up a function that will be called whenever the specified event is delivered to the target."
          },
          {
            id: "q-0.4-3-v2",
            question: "What parameter is automatically passed by the browser to an event handler callback function when an event fires?",
            options: [
              { id: "A", text: "An Event object containing metadata about the interaction (e.g., target, coordinates)", explanationIfWrong: "" },
              { id: "B", text: "The entire server source code", explanationIfWrong: "Event handlers do not receive server source code." },
              { id: "C", text: "The user's credit card number", explanationIfWrong: "Event objects do not contain private billing data." },
              { id: "D", text: "A binary JPEG screenshot of the desktop", explanationIfWrong: "The Event object contains interaction properties, not image files." }
            ],
            correctAnswer: "A",
            explanationNote: "The browser automatically passes an Event object (commonly named 'e' or 'event') to the handler function with details about the event."
          }
        ]
      },
      {
        heading: "Asynchronous Callbacks & The Event Loop",
        text: "JavaScript is single-threaded. The Event Loop processes completed timers and network requests from the Callback Queue without freezing UI.",
        codeSnippet: `console.log("Start");\nsetTimeout(() => console.log("Timer done"), 1000);\nconsole.log("End");`,
        terminalOutput: `Start -> End -> Timer done`,
        mcq: {
          id: "q-0.4-4-v1",
          question: "JavaScript runs on a single execution thread. How does the browser execute asynchronous operations without freezing the user interface?",
          options: [
            { id: "A", text: "Through the asynchronous Event Loop and Callback Queue", explanationIfWrong: "" },
            { id: "B", text: "By spawning 10,000 hardware CPU cores for every webpage", explanationIfWrong: "Hardware CPU cores are limited; JavaScript uses an event-driven loop." },
            { id: "C", text: "By pausing the user's computer clock", explanationIfWrong: "Clocks continue; asynchronous callbacks wait in a queue." },
            { id: "D", text: "By converting all JavaScript into synchronous Python code", explanationIfWrong: "Browsers run JavaScript directly." }
          ],
          correctAnswer: "A",
          explanationNote: "The Event Loop continuously monitors the Call Stack and Callback Queue, moving asynchronous callbacks onto the stack when execution is idle."
        },
        retestMcq: {
          id: "q-0.4-4-v2",
          question: "Where do completed asynchronous callback functions wait before the Event Loop can move them onto the main Call Stack for execution?",
          options: [
            { id: "A", text: "In the Callback Queue (Task Queue)", explanationIfWrong: "" },
            { id: "B", text: "On the server's hard drive", explanationIfWrong: "Browser callbacks wait in client memory queues." },
            { id: "C", text: "Inside the CSS stylesheet file", explanationIfWrong: "Stylesheets contain CSS rules, not JavaScript task queues." },
            { id: "D", text: "In the DNS lookup table", explanationIfWrong: "DNS resolves hostnames, it does not manage script queues." }
          ],
          correctAnswer: "A",
          explanationNote: "Completed asynchronous tasks (timers, fetch responses, DOM events) wait in the Callback Queue until the Call Stack is empty."
        },
        questionPool: [
          {
            id: "q-0.4-4-v1",
            question: "JavaScript runs on a single execution thread. How does the browser execute asynchronous operations without freezing the user interface?",
            options: [
              { id: "A", text: "Through the asynchronous Event Loop and Callback Queue", explanationIfWrong: "" },
              { id: "B", text: "By spawning 10,000 hardware CPU cores for every webpage", explanationIfWrong: "Hardware CPU cores are limited; JavaScript uses an event-driven loop." },
              { id: "C", text: "By pausing the user's computer clock", explanationIfWrong: "Clocks continue; asynchronous callbacks wait in a queue." },
              { id: "D", text: "By converting all JavaScript into synchronous Python code", explanationIfWrong: "Browsers run JavaScript directly." }
            ],
            correctAnswer: "A",
            explanationNote: "The Event Loop continuously monitors the Call Stack and Callback Queue, moving asynchronous callbacks onto the stack when execution is idle."
          },
          {
            id: "q-0.4-4-v2",
            question: "Where do completed asynchronous callback functions wait before the Event Loop can move them onto the main Call Stack for execution?",
            options: [
              { id: "A", text: "In the Callback Queue (Task Queue)", explanationIfWrong: "" },
              { id: "B", text: "On the server's hard drive", explanationIfWrong: "Browser callbacks wait in client memory queues." },
              { id: "C", text: "Inside the CSS stylesheet file", explanationIfWrong: "Stylesheets contain CSS rules, not JavaScript task queues." },
              { id: "D", text: "In the DNS lookup table", explanationIfWrong: "DNS resolves hostnames, it does not manage script queues." }
            ],
            correctAnswer: "A",
            explanationNote: "Completed asynchronous tasks (timers, fetch responses, DOM events) wait in the Callback Queue until the Call Stack is empty."
          }
        ]
      },
      {
        heading: "Fetching Data Asynchronously with fetch()",
        text: "The modern fetch() API returns a Promise to retrieve data over HTTP in the background without refreshing the page.",
        codeSnippet: `fetch('/data.json')\n  .then(res => res.json())\n  .then(data => console.log(data));`,
        terminalOutput: `Retrieved JSON array via fetch()`,
        mcq: {
          id: "q-0.4-5-v1",
          question: "Which modern browser API returns a Promise and is standard for making asynchronous HTTP requests in JavaScript?",
          options: [
            { id: "A", text: "fetch()", explanationIfWrong: "" },
            { id: "B", text: "http.download()", explanationIfWrong: "http.download is not a native browser API." },
            { id: "C", text: "document.loadServer()", explanationIfWrong: "document.loadServer does not exist." },
            { id: "D", text: "window.httpRequest()", explanationIfWrong: "window.httpRequest is not a native browser API." }
          ],
          correctAnswer: "A",
          explanationNote: "The fetch() API provides a modern, Promise-based interface for fetching resources asynchronously across the network."
        },
        retestMcq: {
          id: "q-0.4-5-v2",
          question: "Historically, before the modern fetch() API was standardized, what browser object was used to perform AJAX background network requests?",
          options: [
            { id: "A", text: "XMLHttpRequest (XHR)", explanationIfWrong: "" },
            { id: "B", text: "HTMLRequestSocket", explanationIfWrong: "HTMLRequestSocket is not a real web API." },
            { id: "C", text: "FlashDataConnector", explanationIfWrong: "Flash is deprecated and was never the web standard." },
            { id: "D", text: "DOMNetworkBridge", explanationIfWrong: "DOMNetworkBridge does not exist." }
          ],
          correctAnswer: "A",
          explanationNote: "XMLHttpRequest (XHR) was the original browser object that enabled asynchronous background data retrieval (AJAX)."
        },
        questionPool: [
          {
            id: "q-0.4-5-v1",
            question: "Which modern browser API returns a Promise and is standard for making asynchronous HTTP requests in JavaScript?",
            options: [
              { id: "A", text: "fetch()", explanationIfWrong: "" },
              { id: "B", text: "http.download()", explanationIfWrong: "http.download is not a native browser API." },
              { id: "C", text: "document.loadServer()", explanationIfWrong: "document.loadServer does not exist." },
              { id: "D", text: "window.httpRequest()", explanationIfWrong: "window.httpRequest is not a native browser API." }
            ],
            correctAnswer: "A",
            explanationNote: "The fetch() API provides a modern, Promise-based interface for fetching resources asynchronously across the network."
          },
          {
            id: "q-0.4-5-v2",
            question: "Historically, before the modern fetch() API was standardized, what browser object was used to perform AJAX background network requests?",
            options: [
              { id: "A", text: "XMLHttpRequest (XHR)", explanationIfWrong: "" },
              { id: "B", text: "HTMLRequestSocket", explanationIfWrong: "HTMLRequestSocket is not a real web API." },
              { id: "C", text: "FlashDataConnector", explanationIfWrong: "Flash is deprecated and was never the web standard." },
              { id: "D", text: "DOMNetworkBridge", explanationIfWrong: "DOMNetworkBridge does not exist." }
            ],
            correctAnswer: "A",
            explanationNote: "XMLHttpRequest (XHR) was the original browser object that enabled asynchronous background data retrieval (AJAX)."
          }
        ]
      }
    ]
  },
  {
    id: "0-5-spa-ajax-json",
    number: "0.5",
    title: "Single Page Applications (SPA) & AJAX JSON Fetching",
    subtitle: "Explore modern SPA architecture, JSON data exchange, Client-Side Rendering (CSR), and comparing SPAs vs traditional websites.",
    readTime: "15 min",
    objectives: [
      "Define Single Page Applications (SPAs) and how they revolutionize user experience",
      "Master JSON (JavaScript Object Notation) syntax, serialization, and parsing",
      "Understand the separation of concerns between frontend client and backend REST API",
      "Explain Client-Side Rendering (CSR) and how JavaScript builds views",
      "Inspect the University of Helsinki Full Stack Open SPA Notes application",
      "Critically compare SPAs vs traditional multi-page web applications"
    ],
    theoryBlocks: [
      {
        heading: "Single Page Application (SPA) Fundamentals",
        text: "An SPA loads a single HTML shell once. Navigation updates the DOM in-memory via JavaScript without reloading the entire page.",
        codeSnippet: `// SPA flow: Load HTML shell once -> Fetch JSON data -> Update DOM in place`,
        terminalOutput: `Zero full-page reloads on navigation`,
        mcq: {
          id: "q-0.5-0-v1",
          question: "What fundamentally defines a Single Page Application (SPA)?",
          options: [
            { id: "A", text: "The browser loads a single initial HTML page and dynamically updates the DOM via JavaScript without reloading the entire page", explanationIfWrong: "" },
            { id: "B", text: "The application can only contain a maximum of 50 words of text", explanationIfWrong: "SPAs can be arbitrarily large enterprise platforms." },
            { id: "C", text: "The web page cannot connect to any internet server", explanationIfWrong: "SPAs communicate constantly with backend servers via APIs." },
            { id: "D", text: "The code must be written in assembly language", explanationIfWrong: "SPAs are written in JavaScript, TypeScript, HTML, and CSS." }
          ],
          correctAnswer: "A",
          explanationNote: "An SPA loads a single web page and updates the body content dynamically via JavaScript APIs without full page reloads."
        },
        retestMcq: {
          id: "q-0.5-0-v2",
          question: "In an SPA architecture, how does the client browser retrieve new data when user navigation occurs?",
          options: [
            { id: "A", text: "It fetches raw data (typically JSON) from a backend API asynchronously in the background", explanationIfWrong: "" },
            { id: "B", text: "It downloads and installs an executable .exe installer file", explanationIfWrong: "Web apps do not download desktop installer binaries." },
            { id: "C", text: "It restarts the user's computer", explanationIfWrong: "Navigation is handled smoothly in-memory." },
            { id: "D", text: "It makes a phone call to the server technician", explanationIfWrong: "Data transfer is automated over HTTP." }
          ],
          correctAnswer: "A",
          explanationNote: "SPAs fetch raw data (usually JSON) via background HTTP requests (fetch/AJAX) and render the data into the existing DOM."
        },
        questionPool: [
          {
            id: "q-0.5-0-v1",
            question: "What fundamentally defines a Single Page Application (SPA)?",
            options: [
              { id: "A", text: "The browser loads a single initial HTML page and dynamically updates the DOM via JavaScript without reloading the entire page", explanationIfWrong: "" },
              { id: "B", text: "The application can only contain a maximum of 50 words of text", explanationIfWrong: "SPAs can be arbitrarily large enterprise platforms." },
              { id: "C", text: "The web page cannot connect to any internet server", explanationIfWrong: "SPAs communicate constantly with backend servers via APIs." },
              { id: "D", text: "The code must be written in assembly language", explanationIfWrong: "SPAs are written in JavaScript, TypeScript, HTML, and CSS." }
            ],
            correctAnswer: "A",
            explanationNote: "An SPA loads a single web page and updates the body content dynamically via JavaScript APIs without full page reloads."
          },
          {
            id: "q-0.5-0-v2",
            question: "In an SPA architecture, how does the client browser retrieve new data when user navigation occurs?",
            options: [
              { id: "A", text: "It fetches raw data (typically JSON) from a backend API asynchronously in the background", explanationIfWrong: "" },
              { id: "B", text: "It downloads and installs an executable .exe installer file", explanationIfWrong: "Web apps do not download desktop installer binaries." },
              { id: "C", text: "It restarts the user's computer", explanationIfWrong: "Navigation is handled smoothly in-memory." },
              { id: "D", text: "It makes a phone call to the server technician", explanationIfWrong: "Data transfer is automated over HTTP." }
            ],
            correctAnswer: "A",
            explanationNote: "SPAs fetch raw data (usually JSON) via background HTTP requests (fetch/AJAX) and render the data into the existing DOM."
          }
        ]
      },
      {
        heading: "JSON (JavaScript Object Notation) as Data Format",
        text: "JSON is the standard text data format of the web. Use JSON.parse() to convert text to objects and JSON.stringify() to encode objects.",
        codeSnippet: `const str = JSON.stringify({ note: "Hello" });\nconst obj = JSON.parse(str);`,
        terminalOutput: `{"note":"Hello"} parsed to object`,
        mcq: {
          id: "q-0.5-1-v1",
          question: "What is JSON (JavaScript Object Notation) in modern web development?",
          options: [
            { id: "A", text: "A lightweight, text-based data interchange format derived from JavaScript object syntax", explanationIfWrong: "" },
            { id: "B", text: "A compiled binary file format executable only on Windows", explanationIfWrong: "JSON is plain text and cross-platform." },
            { id: "C", text: "A proprietary database engine owned by Oracle", explanationIfWrong: "JSON is an open data format, not a database engine." },
            { id: "D", text: "A replacement for HTML tags", explanationIfWrong: "JSON formats data, it does not replace HTML markup." }
          ],
          correctAnswer: "A",
          explanationNote: "JSON is a standard text-based format for representing structured data based on JavaScript object syntax."
        },
        retestMcq: {
          id: "q-0.5-1-v2",
          question: "Which built-in JavaScript method parses a raw JSON formatted text string into a usable JavaScript object?",
          options: [
            { id: "A", text: "JSON.parse(jsonString)", explanationIfWrong: "" },
            { id: "B", text: "JSON.stringify(object)", explanationIfWrong: "JSON.stringify converts a JavaScript object into a JSON string, not vice-versa." },
            { id: "C", text: "document.parseJson()", explanationIfWrong: "document.parseJson does not exist." },
            { id: "D", text: "Object.decode()", explanationIfWrong: "Object.decode is not a native JavaScript method." }
          ],
          correctAnswer: "A",
          explanationNote: "JSON.parse() takes a JSON string and transforms it into the corresponding JavaScript object or array."
        },
        questionPool: [
          {
            id: "q-0.5-1-v1",
            question: "What is JSON (JavaScript Object Notation) in modern web development?",
            options: [
              { id: "A", text: "A lightweight, text-based data interchange format derived from JavaScript object syntax", explanationIfWrong: "" },
              { id: "B", text: "A compiled binary file format executable only on Windows", explanationIfWrong: "JSON is plain text and cross-platform." },
              { id: "C", text: "A proprietary database engine owned by Oracle", explanationIfWrong: "JSON is an open data format, not a database engine." },
              { id: "D", text: "A replacement for HTML tags", explanationIfWrong: "JSON formats data, it does not replace HTML markup." }
            ],
            correctAnswer: "A",
            explanationNote: "JSON is a standard text-based format for representing structured data based on JavaScript object syntax."
          },
          {
            id: "q-0.5-1-v2",
            question: "Which built-in JavaScript method parses a raw JSON formatted text string into a usable JavaScript object?",
            options: [
              { id: "A", text: "JSON.parse(jsonString)", explanationIfWrong: "" },
              { id: "B", text: "JSON.stringify(object)", explanationIfWrong: "JSON.stringify converts a JavaScript object into a JSON string, not vice-versa." },
              { id: "C", text: "document.parseJson()", explanationIfWrong: "document.parseJson does not exist." },
              { id: "D", text: "Object.decode()", explanationIfWrong: "Object.decode is not a native JavaScript method." }
            ],
            correctAnswer: "A",
            explanationNote: "JSON.parse() takes a JSON string and transforms it into the corresponding JavaScript object or array."
          }
        ]
      },
      {
        heading: "Separation of Concerns: Frontend vs Backend API",
        text: "The frontend client renders components and handles user interactions. The backend REST API handles database persistence and business rules.",
        codeSnippet: `// Client (React) <--- JSON over HTTP ---> Backend API (Express + DB)`,
        terminalOutput: `API returns JSON data payload`,
        mcq: {
          id: "q-0.5-2-v1",
          question: "In modern full-stack web architecture, what is the primary responsibility of the backend REST API?",
          options: [
            { id: "A", text: "To provide data endpoints (CRUD), business logic, and database persistence, typically returning JSON", explanationIfWrong: "" },
            { id: "B", text: "To dictate pixel colors and CSS animations in the user's browser", explanationIfWrong: "Pixel styling and animation are frontend client responsibilities." },
            { id: "C", text: "To play background music on the client speakers", explanationIfWrong: "Audio playback is handled by the browser client." },
            { id: "D", text: "To manufacture computer monitor displays", explanationIfWrong: "Hardware manufacturing is unrelated to software APIs." }
          ],
          correctAnswer: "A",
          explanationNote: "The backend API is responsible for processing data, enforcing security, communicating with databases, and returning clean data (usually JSON)."
        },
        retestMcq: {
          id: "q-0.5-2-v2",
          question: "In a decoupled full-stack SPA architecture, which tier is responsible for managing visual DOM elements and handling user clicks?",
          options: [
            { id: "A", text: "The frontend client code running in the user's browser", explanationIfWrong: "" },
            { id: "B", text: "The PostgreSQL database server", explanationIfWrong: "Databases store records; they do not handle DOM elements." },
            { id: "C", text: "The transatlantic fiber optic cables", explanationIfWrong: "Physical cables transmit network bits." },
            { id: "D", text: "The Linux kernel on the cloud host", explanationIfWrong: "The browser client manages the DOM." }
          ],
          correctAnswer: "A",
          explanationNote: "The frontend client application running in the user's web browser is responsible for managing the DOM and UI interactions."
        },
        questionPool: [
          {
            id: "q-0.5-2-v1",
            question: "In modern full-stack web architecture, what is the primary responsibility of the backend REST API?",
            options: [
              { id: "A", text: "To provide data endpoints (CRUD), business logic, and database persistence, typically returning JSON", explanationIfWrong: "" },
              { id: "B", text: "To dictate pixel colors and CSS animations in the user's browser", explanationIfWrong: "Pixel styling and animation are frontend client responsibilities." },
              { id: "C", text: "To play background music on the client speakers", explanationIfWrong: "Audio playback is handled by the browser client." },
              { id: "D", text: "To manufacture computer monitor displays", explanationIfWrong: "Hardware manufacturing is unrelated to software APIs." }
            ],
            correctAnswer: "A",
            explanationNote: "The backend API is responsible for processing data, enforcing security, communicating with databases, and returning clean data (usually JSON)."
          },
          {
            id: "q-0.5-2-v2",
            question: "In a decoupled full-stack SPA architecture, which tier is responsible for managing visual DOM elements and handling user clicks?",
            options: [
              { id: "A", text: "The frontend client code running in the user's browser", explanationIfWrong: "" },
              { id: "B", text: "The PostgreSQL database server", explanationIfWrong: "Databases store records; they do not handle DOM elements." },
              { id: "C", text: "The transatlantic fiber optic cables", explanationIfWrong: "Physical cables transmit network bits." },
              { id: "D", text: "The Linux kernel on the cloud host", explanationIfWrong: "The browser client manages the DOM." }
            ],
            correctAnswer: "A",
            explanationNote: "The frontend client application running in the user's web browser is responsible for managing the DOM and UI interactions."
          }
        ]
      },
      {
        heading: "Client-Side Rendering (CSR)",
        text: "In CSR, the server sends a minimal HTML shell with an empty '<div id=\"root\"></div>'. JavaScript creates all visual elements in the browser.",
        codeSnippet: `<!-- Initial HTML Shell -->\n<div id="root"></div>\n<script src="/bundle.js"></script>`,
        terminalOutput: `bundle.js creates DOM elements dynamically`,
        mcq: {
          id: "q-0.5-3-v1",
          question: "What is Client-Side Rendering (CSR)?",
          options: [
            { id: "A", text: "The browser's JavaScript receives raw data and generates the HTML elements directly on the user's client device", explanationIfWrong: "" },
            { id: "B", text: "The web server generates all HTML strings before transmitting them", explanationIfWrong: "That is Server-Side Rendering (SSR)." },
            { id: "C", text: "The website prints documents on a local paper printer", explanationIfWrong: "Rendering refers to display on screen." },
            { id: "D", text: "The user manually writes CSS rules into the address bar", explanationIfWrong: "CSR is automated JavaScript rendering." }
          ],
          correctAnswer: "A",
          explanationNote: "Client-Side Rendering delegates the creation and manipulation of HTML DOM nodes to JavaScript executing in the user's browser."
        },
        retestMcq: {
          id: "q-0.5-3-v2",
          question: "What typically happens if a user visits a purely client-rendered (CSR) Single Page Application with JavaScript disabled in their browser?",
          options: [
            { id: "A", text: "The page remains blank or shows only an empty root container because JavaScript is needed to generate the content", explanationIfWrong: "" },
            { id: "B", text: "The page automatically converts into a mobile iOS app", explanationIfWrong: "Disabling JavaScript halts client execution." },
            { id: "C", text: "The computer's hard drive is wiped clean", explanationIfWrong: "Browser settings do not affect hard drives." },
            { id: "D", text: "The website renders 10 times faster with all animations", explanationIfWrong: "Without JavaScript, CSR applications cannot build the DOM." }
          ],
          correctAnswer: "A",
          explanationNote: "Because pure CSR applications rely on JavaScript to construct the DOM tree inside an empty root container, disabling JavaScript leaves the page blank."
        },
        questionPool: [
          {
            id: "q-0.5-3-v1",
            question: "What is Client-Side Rendering (CSR)?",
            options: [
              { id: "A", text: "The browser's JavaScript receives raw data and generates the HTML elements directly on the user's client device", explanationIfWrong: "" },
              { id: "B", text: "The web server generates all HTML strings before transmitting them", explanationIfWrong: "That is Server-Side Rendering (SSR)." },
              { id: "C", text: "The website prints documents on a local paper printer", explanationIfWrong: "Rendering refers to display on screen." },
              { id: "D", text: "The user manually writes CSS rules into the address bar", explanationIfWrong: "CSR is automated JavaScript rendering." }
            ],
            correctAnswer: "A",
            explanationNote: "Client-Side Rendering delegates the creation and manipulation of HTML DOM nodes to JavaScript executing in the user's browser."
          },
          {
            id: "q-0.5-3-v2",
            question: "What typically happens if a user visits a purely client-rendered (CSR) Single Page Application with JavaScript disabled in their browser?",
            options: [
              { id: "A", text: "The page remains blank or shows only an empty root container because JavaScript is needed to generate the content", explanationIfWrong: "" },
              { id: "B", text: "The page automatically converts into a mobile iOS app", explanationIfWrong: "Disabling JavaScript halts client execution." },
              { id: "C", text: "The computer's hard drive is wiped clean", explanationIfWrong: "Browser settings do not affect hard drives." },
              { id: "D", text: "The website renders 10 times faster with all animations", explanationIfWrong: "Without JavaScript, CSR applications cannot build the DOM." }
            ],
            correctAnswer: "A",
            explanationNote: "Because pure CSR applications rely on JavaScript to construct the DOM tree inside an empty root container, disabling JavaScript leaves the page blank."
          }
        ]
      },
      {
        heading: "Full Stack Open Notes App (SPA Version)",
        text: "In the Helsinki SPA version, adding a note appends it to the DOM immediately and dispatches an asynchronous POST with JSON. No reload happens.",
        codeSnippet: `notes.push(note);\nredrawNotes(); // Instant UI update\nsendToServer(note); // POST JSON in background`,
        terminalOutput: `POST /new_note_spa -> 201 Created (no redirect)`,
        mcq: {
          id: "q-0.5-4-v1",
          question: "In the University of Helsinki SPA Notes app, what does the server return when a new note is successfully submitted via POST?",
          options: [
            { id: "A", text: "Status 201 Created with a confirmation JSON message (no page redirect)", explanationIfWrong: "" },
            { id: "B", text: "A 302 redirect forcing a full HTML page reload", explanationIfWrong: "That was the traditional app; the SPA app does not redirect." },
            { id: "C", text: "A complete 50-megabyte video file", explanationIfWrong: "The response is a tiny JSON confirmation." },
            { id: "D", text: "Status 404 Not Found", explanationIfWrong: "The request succeeds with 201 Created." }
          ],
          correctAnswer: "A",
          explanationNote: "In the SPA version, the server receives the JSON note payload and responds with 201 Created without issuing any redirect."
        },
        retestMcq: {
          id: "q-0.5-4-v2",
          question: "How does the Helsinki SPA Notes app render the newly created note to the screen after the user clicks Save?",
          options: [
            { id: "A", text: "The JavaScript code appends the note directly to the local array and immediately updates the DOM without reloading", explanationIfWrong: "" },
            { id: "B", text: "It asks the user to manually refresh the browser", explanationIfWrong: "The DOM updates automatically via JavaScript." },
            { id: "C", text: "It restarts the web server", explanationIfWrong: "The server continues running without restarts." },
            { id: "D", text: "It navigates to an entirely different external domain", explanationIfWrong: "The SPA remains on the same page." }
          ],
          correctAnswer: "A",
          explanationNote: "The SPA version immediately updates its in-memory notes array and re-renders the DOM list on the client side."
        },
        questionPool: [
          {
            id: "q-0.5-4-v1",
            question: "In the University of Helsinki SPA Notes app, what does the server return when a new note is successfully submitted via POST?",
            options: [
              { id: "A", text: "Status 201 Created with a confirmation JSON message (no page redirect)", explanationIfWrong: "" },
              { id: "B", text: "A 302 redirect forcing a full HTML page reload", explanationIfWrong: "That was the traditional app; the SPA app does not redirect." },
              { id: "C", text: "A complete 50-megabyte video file", explanationIfWrong: "The response is a tiny JSON confirmation." },
              { id: "D", text: "Status 404 Not Found", explanationIfWrong: "The request succeeds with 201 Created." }
            ],
            correctAnswer: "A",
            explanationNote: "In the SPA version, the server receives the JSON note payload and responds with 201 Created without issuing any redirect."
          },
          {
            id: "q-0.5-4-v2",
            question: "How does the Helsinki SPA Notes app render the newly created note to the screen after the user clicks Save?",
            options: [
              { id: "A", text: "The JavaScript code appends the note directly to the local array and immediately updates the DOM without reloading", explanationIfWrong: "" },
              { id: "B", text: "It asks the user to manually refresh the browser", explanationIfWrong: "The DOM updates automatically via JavaScript." },
              { id: "C", text: "It restarts the web server", explanationIfWrong: "The server continues running without restarts." },
              { id: "D", text: "It navigates to an entirely different external domain", explanationIfWrong: "The SPA remains on the same page." }
            ],
            correctAnswer: "A",
            explanationNote: "The SPA version immediately updates its in-memory notes array and re-renders the DOM list on the client side."
          }
        ]
      },
      {
        heading: "Comparing SPAs vs Traditional Web Applications",
        text: "SPAs deliver fast, app-like transitions without page reloads. Traditional multi-page apps offer simpler built-in SEO and instant first paint.",
        codeSnippet: `// Traditional: Full reload on every click\n// SPA: Fast in-memory DOM swap + background JSON`,
        terminalOutput: `SPA: 10 navigations = 0 full page reloads`,
        mcq: {
          id: "q-0.5-5-v1",
          question: "Which of the following is a primary user experience advantage of Single Page Applications over traditional web applications?",
          options: [
            { id: "A", text: "Fast, seamless page transitions without white flash or disruptive full page reloads", explanationIfWrong: "" },
            { id: "B", text: "Zero network data usage under all circumstances", explanationIfWrong: "SPAs still transfer data over the network via APIs." },
            { id: "C", text: "Elimination of all computer security risks", explanationIfWrong: "SPAs have their own security considerations (e.g. XSS, CORS)." },
            { id: "D", text: "Ability to run without any operating system", explanationIfWrong: "All software requires an operating system or runtime." }
          ],
          correctAnswer: "A",
          explanationNote: "SPAs provide a smooth, fluid user experience by updating only the necessary parts of the DOM without full page refreshes."
        },
        retestMcq: {
          id: "q-0.5-5-v2",
          question: "What is an architectural challenge commonly associated with purely client-rendered SPAs compared to traditional server-rendered websites?",
          options: [
            { id: "A", text: "Larger initial JavaScript bundle downloads and potential Search Engine Optimization (SEO) hurdles", explanationIfWrong: "" },
            { id: "B", text: "Inability to display any color other than black and white", explanationIfWrong: "CSS styling is identical across both architectures." },
            { id: "C", text: "SPAs cannot be viewed on smartphones", explanationIfWrong: "SPAs run exceptionally well on mobile browsers." },
            { id: "D", text: "HTTP requests are completely illegal in SPAs", explanationIfWrong: "SPAs rely extensively on HTTP requests." }
          ],
          correctAnswer: "A",
          explanationNote: "Pure SPAs require downloading client JavaScript bundles before initial render, which can slow down first paint and complicate web crawler indexing."
        },
        questionPool: [
          {
            id: "q-0.5-5-v1",
            question: "Which of the following is a primary user experience advantage of Single Page Applications over traditional web applications?",
            options: [
              { id: "A", text: "Fast, seamless page transitions without white flash or disruptive full page reloads", explanationIfWrong: "" },
              { id: "B", text: "Zero network data usage under all circumstances", explanationIfWrong: "SPAs still transfer data over the network via APIs." },
              { id: "C", text: "Elimination of all computer security risks", explanationIfWrong: "SPAs have their own security considerations (e.g. XSS, CORS)." },
              { id: "D", text: "Ability to run without any operating system", explanationIfWrong: "All software requires an operating system or runtime." }
            ],
            correctAnswer: "A",
            explanationNote: "SPAs provide a smooth, fluid user experience by updating only the necessary parts of the DOM without full page refreshes."
          },
          {
            id: "q-0.5-5-v2",
            question: "What is an architectural challenge commonly associated with purely client-rendered SPAs compared to traditional server-rendered websites?",
            options: [
              { id: "A", text: "Larger initial JavaScript bundle downloads and potential Search Engine Optimization (SEO) hurdles", explanationIfWrong: "" },
              { id: "B", text: "Inability to display any color other than black and white", explanationIfWrong: "CSS styling is identical across both architectures." },
              { id: "C", text: "SPAs cannot be viewed on smartphones", explanationIfWrong: "SPAs run exceptionally well on mobile browsers." },
              { id: "D", text: "HTTP requests are completely illegal in SPAs", explanationIfWrong: "SPAs rely extensively on HTTP requests." }
            ],
            correctAnswer: "A",
            explanationNote: "Pure SPAs require downloading client JavaScript bundles before initial render, which can slow down first paint and complicate web crawler indexing."
          }
        ]
      }
    ]
  },
  {
    id: "0-6-forms-post-sequence",
    number: "0.6",
    title: "Forms, HTTP POST Requests & Sequence Diagrams",
    subtitle: "Analyze HTML form submissions, event prevention, chronological sequence diagrams, and key takeaways from Helsinki Part 0 exercises.",
    readTime: "15 min",
    objectives: [
      "Understand traditional HTML form submissions and Content-Type encoding",
      "Prevent browser page reloads in SPA forms using event.preventDefault()",
      "Interpret sequence diagrams depicting chronological client-server communication",
      "Trace the full sequence diagram of creating a note in traditional web apps",
      "Trace the sequence diagram of creating a note in modern SPAs",
      "Synthesize core Part 0 architectural concepts before progressing to React in Part 1"
    ],
    theoryBlocks: [
      {
        heading: "Traditional Form Submissions & Form Encodings",
        text: "Submitting a form with method='POST' packages inputs into the request body encoded as application/x-www-form-urlencoded and navigates to the response.",
        codeSnippet: `<form action="/new_note" method="POST">\n  <input type="text" name="note" />\n  <button type="submit">Save</button>\n</form>`,
        terminalOutput: `POST /new_note (payload: note=learn)`,
        mcq: {
          id: "q-0.6-0-v1",
          question: "In a standard HTML form with method='POST', what happens by default when the user clicks the submit button?",
          options: [
            { id: "A", text: "The browser packages input values into an HTTP POST request and initiates a full page navigation", explanationIfWrong: "" },
            { id: "B", text: "The browser sends an SMS text message to the server administrator", explanationIfWrong: "Forms submit HTTP requests, not SMS messages." },
            { id: "C", text: "The inputs are encrypted using quantum cryptography automatically", explanationIfWrong: "Standard HTTP forms use standard urlencoded or multipart formatting." },
            { id: "D", text: "The browser disables user keyboard input permanently", explanationIfWrong: "Form submission is standard browser behavior." }
          ],
          correctAnswer: "A",
          explanationNote: "Standard HTML form submission sends an HTTP POST request to the action URL and navigates the browser to the response page."
        },
        retestMcq: {
          id: "q-0.6-0-v2",
          question: "What is the default Content-Type header encoding used by HTML forms when submitting standard text inputs via POST?",
          options: [
            { id: "A", text: "application/x-www-form-urlencoded", explanationIfWrong: "" },
            { id: "B", text: "application/pdf", explanationIfWrong: "application/pdf is for PDF documents." },
            { id: "C", text: "image/svg+xml", explanationIfWrong: "image/svg is for vector graphics." },
            { id: "D", text: "text/css", explanationIfWrong: "text/css is for stylesheets." }
          ],
          correctAnswer: "A",
          explanationNote: "The default encoding for HTML forms is 'application/x-www-form-urlencoded', where key-value pairs are separated by ampersands."
        },
        questionPool: [
          {
            id: "q-0.6-0-v1",
            question: "In a standard HTML form with method='POST', what happens by default when the user clicks the submit button?",
            options: [
              { id: "A", text: "The browser packages input values into an HTTP POST request and initiates a full page navigation", explanationIfWrong: "" },
              { id: "B", text: "The browser sends an SMS text message to the server administrator", explanationIfWrong: "Forms submit HTTP requests, not SMS messages." },
              { id: "C", text: "The inputs are encrypted using quantum cryptography automatically", explanationIfWrong: "Standard HTTP forms use standard urlencoded or multipart formatting." },
              { id: "D", text: "The browser disables user keyboard input permanently", explanationIfWrong: "Form submission is standard browser behavior." }
            ],
            correctAnswer: "A",
            explanationNote: "Standard HTML form submission sends an HTTP POST request to the action URL and navigates the browser to the response page."
          },
          {
            id: "q-0.6-0-v2",
            question: "What is the default Content-Type header encoding used by HTML forms when submitting standard text inputs via POST?",
            options: [
              { id: "A", text: "application/x-www-form-urlencoded", explanationIfWrong: "" },
              { id: "B", text: "application/pdf", explanationIfWrong: "application/pdf is for PDF documents." },
              { id: "C", text: "image/svg+xml", explanationIfWrong: "image/svg is for vector graphics." },
              { id: "D", text: "text/css", explanationIfWrong: "text/css is for stylesheets." }
            ],
            correctAnswer: "A",
            explanationNote: "The default encoding for HTML forms is 'application/x-www-form-urlencoded', where key-value pairs are separated by ampersands."
          }
        ]
      },
      {
        heading: "Preventing Page Reload with event.preventDefault()",
        text: "In SPA forms, call event.preventDefault() inside the submit listener to cancel the default full page reload and handle data via fetch.",
        codeSnippet: `form.addEventListener('submit', (e) => {\n  e.preventDefault(); // Stop page reload!\n  saveNoteViaApi({ content: input.value });\n});`,
        terminalOutput: `e.preventDefault() called -> 0 reload`,
        mcq: {
          id: "q-0.6-1-v1",
          question: "Why is 'event.preventDefault()' called inside an SPA form submit event listener?",
          options: [
            { id: "A", text: "To prevent the browser from executing its default full-page reload and navigation", explanationIfWrong: "" },
            { id: "B", text: "To stop the user's internet connection completely", explanationIfWrong: "preventDefault only stops the default browser action for that event." },
            { id: "C", text: "To format the input text into uppercase letters", explanationIfWrong: "Text formatting is handled by CSS or string methods." },
            { id: "D", text: "To shut down the backend server", explanationIfWrong: "preventDefault has no effect on server processes." }
          ],
          correctAnswer: "A",
          explanationNote: "event.preventDefault() halts the default action that the browser would normally take (in this case, submitting the form and refreshing the page)."
        },
        retestMcq: {
          id: "q-0.6-1-v2",
          question: "What happens if a developer creates an SPA form submit handler but forgets to invoke 'event.preventDefault()'?",
          options: [
            { id: "A", text: "The browser reloads the entire page, discarding in-memory JavaScript state", explanationIfWrong: "" },
            { id: "B", text: "The browser window immediately closes", explanationIfWrong: "The browser executes standard form navigation, not window closure." },
            { id: "C", text: "The form input text turns into an image", explanationIfWrong: "Inputs remain standard HTML elements." },
            { id: "D", text: "JavaScript permanently uninstalls itself from the computer", explanationIfWrong: "The browser simply executes default navigation." }
          ],
          correctAnswer: "A",
          explanationNote: "Without preventDefault(), the browser performs its native form submission behavior, causing a full page refresh and clearing client state."
        },
        questionPool: [
          {
            id: "q-0.6-1-v1",
            question: "Why is 'event.preventDefault()' called inside an SPA form submit event listener?",
            options: [
              { id: "A", text: "To prevent the browser from executing its default full-page reload and navigation", explanationIfWrong: "" },
              { id: "B", text: "To stop the user's internet connection completely", explanationIfWrong: "preventDefault only stops the default browser action for that event." },
              { id: "C", text: "To format the input text into uppercase letters", explanationIfWrong: "Text formatting is handled by CSS or string methods." },
              { id: "D", text: "To shut down the backend server", explanationIfWrong: "preventDefault has no effect on server processes." }
            ],
            correctAnswer: "A",
            explanationNote: "event.preventDefault() halts the default action that the browser would normally take (in this case, submitting the form and refreshing the page)."
          },
          {
            id: "q-0.6-1-v2",
            question: "What happens if a developer creates an SPA form submit handler but forgets to invoke 'event.preventDefault()'?",
            options: [
              { id: "A", text: "The browser reloads the entire page, discarding in-memory JavaScript state", explanationIfWrong: "" },
              { id: "B", text: "The browser window immediately closes", explanationIfWrong: "The browser executes standard form navigation, not window closure." },
              { id: "C", text: "The form input text turns into an image", explanationIfWrong: "Inputs remain standard HTML elements." },
              { id: "D", text: "JavaScript permanently uninstalls itself from the computer", explanationIfWrong: "The browser simply executes default navigation." }
            ],
            correctAnswer: "A",
            explanationNote: "Without preventDefault(), the browser performs its native form submission behavior, causing a full page refresh and clearing client state."
          }
        ]
      },
      {
        heading: "Sequence Diagrams in Web Architecture",
        text: "Sequence diagrams illustrate chronological requests and responses between actors (Browser, Server) across vertical lifelines from top to bottom.",
        codeSnippet: `// Browser -> Server: HTTP GET /notes\n// Server --> Browser: 200 OK (HTML document)`,
        terminalOutput: `Chronological message exchange over time`,
        mcq: {
          id: "q-0.6-2-v1",
          question: "What is a sequence diagram used for in web application development?",
          options: [
            { id: "A", text: "To visually depict the chronological order of requests and responses exchanged between browser, server, and other actors", explanationIfWrong: "" },
            { id: "B", text: "To edit image files and compress JPEG pictures", explanationIfWrong: "Sequence diagrams model architectural communication, not image compression." },
            { id: "C", text: "To measure CPU chip temperatures", explanationIfWrong: "Hardware sensors measure temperature; sequence diagrams model message flows." },
            { id: "D", text: "To generate CSS color palettes", explanationIfWrong: "Sequence diagrams depict temporal message exchanges." }
          ],
          correctAnswer: "A",
          explanationNote: "A sequence diagram displays interaction between objects or actors in sequential order over time."
        },
        retestMcq: {
          id: "q-0.6-2-v2",
          question: "In a web application sequence diagram, what do the vertical dashed lines descending from each participant represent?",
          options: [
            { id: "A", text: "The lifelines of participating actors (Browser, Server) across time", explanationIfWrong: "" },
            { id: "B", text: "Electric power cables connecting computers", explanationIfWrong: "The diagram is a logical modeling representation, not a hardware wiring chart." },
            { id: "C", text: "The number of lines of JavaScript code in each file", explanationIfWrong: "Vertical dashed lines depict the progression of time." },
            { id: "D", text: "The percentage of RAM remaining", explanationIfWrong: "Sequence diagrams illustrate actor lifelines over time." }
          ],
          correctAnswer: "A",
          explanationNote: "In sequence diagrams, the vertical dashed lines represent the lifelines of the participating entities over chronological time."
        },
        questionPool: [
          {
            id: "q-0.6-2-v1",
            question: "What is a sequence diagram used for in web application development?",
            options: [
              { id: "A", text: "To visually depict the chronological order of requests and responses exchanged between browser, server, and other actors", explanationIfWrong: "" },
              { id: "B", text: "To edit image files and compress JPEG pictures", explanationIfWrong: "Sequence diagrams model architectural communication, not image compression." },
              { id: "C", text: "To measure CPU chip temperatures", explanationIfWrong: "Hardware sensors measure temperature; sequence diagrams model message flows." },
              { id: "D", text: "To generate CSS color palettes", explanationIfWrong: "Sequence diagrams depict temporal message exchanges." }
            ],
            correctAnswer: "A",
            explanationNote: "A sequence diagram displays interaction between objects or actors in sequential order over time."
          },
          {
            id: "q-0.6-2-v2",
            question: "In a web application sequence diagram, what do the vertical dashed lines descending from each participant represent?",
            options: [
              { id: "A", text: "The lifelines of participating actors (Browser, Server) across time", explanationIfWrong: "" },
              { id: "B", text: "Electric power cables connecting computers", explanationIfWrong: "The diagram is a logical modeling representation, not a hardware wiring chart." },
              { id: "C", text: "The number of lines of JavaScript code in each file", explanationIfWrong: "Vertical dashed lines depict the progression of time." },
              { id: "D", text: "The percentage of RAM remaining", explanationIfWrong: "Sequence diagrams illustrate actor lifelines over time." }
            ],
            correctAnswer: "A",
            explanationNote: "In sequence diagrams, the vertical dashed lines represent the lifelines of the participating entities over chronological time."
          }
        ]
      },
      {
        heading: "Sequence Flow of Traditional Note Creation",
        text: "In the traditional app, creating a note takes 6 requests: POST note, 302 redirect, GET HTML, GET CSS, GET JS, and GET JSON to reload the page.",
        codeSnippet: `// 1. POST /new_note -> 2. 302 Redirect -> 3. GET /notes (reload assets)`,
        terminalOutput: `Total HTTP calls: 6 requests`,
        mcq: {
          id: "q-0.6-3-v1",
          question: "In the Helsinki Full Stack Open Exercise 0.4 sequence, why does the browser request the HTML, CSS, and JS files again after submitting a note?",
          options: [
            { id: "A", text: "Because the server returned an HTTP 302 redirect, instructing the browser to execute a full page reload of /notes", explanationIfWrong: "" },
            { id: "B", text: "Because the browser crashed and had to reboot", explanationIfWrong: "The browser did not crash; it followed the 302 redirect instruction." },
            { id: "C", text: "Because the user closed the laptop lid", explanationIfWrong: "The reload is caused by the server's 302 Found response." },
            { id: "D", text: "Because CSS files expire after 2 milliseconds", explanationIfWrong: "The reload is standard PRG navigation flow." }
          ],
          correctAnswer: "A",
          explanationNote: "The server responds to the POST request with an HTTP 302 Found redirect, causing the browser to reload the page and fetch its assets."
        },
        retestMcq: {
          id: "q-0.6-3-v2",
          question: "In Exercise 0.4, which HTTP request delivers the new note text from the browser to the backend server?",
          options: [
            { id: "A", text: "HTTP POST /exampleapp/new_note with the note text in the request body", explanationIfWrong: "" },
            { id: "B", text: "HTTP GET /exampleapp/data.json", explanationIfWrong: "GET /data.json fetches existing notes; it does not submit a new note." },
            { id: "C", text: "HTTP DELETE /exampleapp/notes", explanationIfWrong: "DELETE removes resources; POST creates them." },
            { id: "D", text: "HTTP OPTIONS /exampleapp/all", explanationIfWrong: "OPTIONS inspects allowed headers, not data creation." }
          ],
          correctAnswer: "A",
          explanationNote: "The form submission triggers an HTTP POST request to /exampleapp/new_note, transmitting the note text inside the request body."
        },
        questionPool: [
          {
            id: "q-0.6-3-v1",
            question: "In the Helsinki Full Stack Open Exercise 0.4 sequence, why does the browser request the HTML, CSS, and JS files again after submitting a note?",
            options: [
              { id: "A", text: "Because the server returned an HTTP 302 redirect, instructing the browser to execute a full page reload of /notes", explanationIfWrong: "" },
              { id: "B", text: "Because the browser crashed and had to reboot", explanationIfWrong: "The browser did not crash; it followed the 302 redirect instruction." },
              { id: "C", text: "Because the user closed the laptop lid", explanationIfWrong: "The reload is caused by the server's 302 Found response." },
              { id: "D", text: "Because CSS files expire after 2 milliseconds", explanationIfWrong: "The reload is standard PRG navigation flow." }
            ],
            correctAnswer: "A",
            explanationNote: "The server responds to the POST request with an HTTP 302 Found redirect, causing the browser to reload the page and fetch its assets."
          },
          {
            id: "q-0.6-3-v2",
            question: "In Exercise 0.4, which HTTP request delivers the new note text from the browser to the backend server?",
            options: [
              { id: "A", text: "HTTP POST /exampleapp/new_note with the note text in the request body", explanationIfWrong: "" },
              { id: "B", text: "HTTP GET /exampleapp/data.json", explanationIfWrong: "GET /data.json fetches existing notes; it does not submit a new note." },
              { id: "C", text: "HTTP DELETE /exampleapp/notes", explanationIfWrong: "DELETE removes resources; POST creates them." },
              { id: "D", text: "HTTP OPTIONS /exampleapp/all", explanationIfWrong: "OPTIONS inspects allowed headers, not data creation." }
            ],
            correctAnswer: "A",
            explanationNote: "The form submission triggers an HTTP POST request to /exampleapp/new_note, transmitting the note text inside the request body."
          }
        ]
      },
      {
        heading: "Sequence Flow of SPA Note Creation",
        text: "In the SPA version, creating a note sends exactly 1 background POST with JSON. The DOM updates locally with zero redirects or page reloads.",
        codeSnippet: `// 1. JS appends note to DOM -> 2. POST /new_note_spa (JSON) -> 201 Created`,
        terminalOutput: `Total HTTP calls: Exactly 1 request`,
        mcq: {
          id: "q-0.6-4-v1",
          question: "How does the network sequence of creating a note in the SPA version (Exercise 0.6) compare to the traditional version?",
          options: [
            { id: "A", text: "The SPA sends a single POST request with JSON and updates the DOM locally without any redirects or page reloads", explanationIfWrong: "" },
            { id: "B", text: "The SPA requires 50 separate server redirects", explanationIfWrong: "The SPA uses zero redirects." },
            { id: "C", text: "The SPA downloads the entire website source code again", explanationIfWrong: "The SPA never re-downloads the page bundle." },
            { id: "D", text: "The SPA submits data via FTP instead of HTTP", explanationIfWrong: "The SPA uses modern HTTP POST with JSON." }
          ],
          correctAnswer: "A",
          explanationNote: "In the SPA version, exactly one HTTP POST request with JSON is sent, and the DOM is updated directly in client memory without any page reload."
        },
        retestMcq: {
          id: "q-0.6-4-v2",
          question: "In the Helsinki SPA Notes app, does creating a new note cause the browser to re-request HTML, CSS, or JS files from the server?",
          options: [
            { id: "A", text: "No, only a single asynchronous background POST request containing JSON is made", explanationIfWrong: "" },
            { id: "B", text: "Yes, all HTML and CSS files must be re-downloaded", explanationIfWrong: "That occurs only in traditional full page reload apps." },
            { id: "C", text: "Yes, but only the CSS stylesheet", explanationIfWrong: "No static asset files are re-downloaded in the SPA flow." },
            { id: "D", text: "Yes, JavaScript files are deleted and re-downloaded", explanationIfWrong: "Client JavaScript remains in memory." }
          ],
          correctAnswer: "A",
          explanationNote: "In an SPA, existing HTML, CSS, and JS remain in memory; only the single POST request containing the new note is sent over the network."
        },
        questionPool: [
          {
            id: "q-0.6-4-v1",
            question: "How does the network sequence of creating a note in the SPA version (Exercise 0.6) compare to the traditional version?",
            options: [
              { id: "A", text: "The SPA sends a single POST request with JSON and updates the DOM locally without any redirects or page reloads", explanationIfWrong: "" },
              { id: "B", text: "The SPA requires 50 separate server redirects", explanationIfWrong: "The SPA uses zero redirects." },
              { id: "C", text: "The SPA downloads the entire website source code again", explanationIfWrong: "The SPA never re-downloads the page bundle." },
              { id: "D", text: "The SPA submits data via FTP instead of HTTP", explanationIfWrong: "The SPA uses modern HTTP POST with JSON." }
            ],
            correctAnswer: "A",
            explanationNote: "In the SPA version, exactly one HTTP POST request with JSON is sent, and the DOM is updated directly in client memory without any page reload."
          },
          {
            id: "q-0.6-4-v2",
            question: "In the Helsinki SPA Notes app, does creating a new note cause the browser to re-request HTML, CSS, or JS files from the server?",
            options: [
              { id: "A", text: "No, only a single asynchronous background POST request containing JSON is made", explanationIfWrong: "" },
              { id: "B", text: "Yes, all HTML and CSS files must be re-downloaded", explanationIfWrong: "That occurs only in traditional full page reload apps." },
              { id: "C", text: "Yes, but only the CSS stylesheet", explanationIfWrong: "No static asset files are re-downloaded in the SPA flow." },
              { id: "D", text: "Yes, JavaScript files are deleted and re-downloaded", explanationIfWrong: "Client JavaScript remains in memory." }
            ],
            correctAnswer: "A",
            explanationNote: "In an SPA, existing HTML, CSS, and JS remain in memory; only the single POST request containing the new note is sent over the network."
          }
        ]
      },
      {
        heading: "Synthesizing Part 0 & Stepping into React",
        text: "Part 0 establishes web fundamentals (HTTP, DOM, JSON, Events). In Part 1, React replaces manual DOM code with declarative components.",
        codeSnippet: `// Part 1 Preview: React Component\nfunction Notes({ list }) {\n  return <ul>{list.map(n => <li key={n.id}>{n.content}</li>)}</ul>;\n}`,
        terminalOutput: `Part 0 Complete -> Ready for Part 1: React`,
        mcq: {
          id: "q-0.6-5-v1",
          question: "Why is mastering the web fundamentals covered in Part 0 essential before learning React in Part 1?",
          options: [
            { id: "A", text: "Because React builds directly on top of HTTP, the DOM tree, event handling, and asynchronous JSON data exchange", explanationIfWrong: "" },
            { id: "B", text: "Because React does not use JavaScript or HTML at all", explanationIfWrong: "React is built directly with JavaScript and JSX." },
            { id: "C", text: "Because web browsers will refuse to install React without a special physical key", explanationIfWrong: "React is an open source library loaded in standard JS." },
            { id: "D", text: "Because React is an obsolete language replaced by assembly", explanationIfWrong: "React is one of the most widely used web libraries in the world." }
          ],
          correctAnswer: "A",
          explanationNote: "React abstracts and streamlines DOM rendering, but the underlying mechanisms (HTTP, JSON, events, component lifecycles) are rooted in web fundamentals."
        },
        retestMcq: {
          id: "q-0.6-5-v2",
          question: "What primary challenge of building complex SPAs with vanilla JavaScript does React address starting in Part 1?",
          options: [
            { id: "A", text: "It replaces tedious, imperative manual DOM manipulation with a declarative, component-driven architecture", explanationIfWrong: "" },
            { id: "B", text: "It prevents users from using the internet", explanationIfWrong: "React applications are built for the internet." },
            { id: "C", text: "It converts HTML into Python backend scripts", explanationIfWrong: "React is a frontend user interface library." },
            { id: "D", text: "It restricts web pages to 10 characters of text", explanationIfWrong: "React scales to massive platforms like Facebook and Netflix." }
          ],
          correctAnswer: "A",
          explanationNote: "React replaces repetitive imperative DOM calls (createElement, appendChild) with a declarative component model that automatically synchronizes the UI with state."
        },
        questionPool: [
          {
            id: "q-0.6-5-v1",
            question: "Why is mastering the web fundamentals covered in Part 0 essential before learning React in Part 1?",
            options: [
              { id: "A", text: "Because React builds directly on top of HTTP, the DOM tree, event handling, and asynchronous JSON data exchange", explanationIfWrong: "" },
              { id: "B", text: "Because React does not use JavaScript or HTML at all", explanationIfWrong: "React is built directly with JavaScript and JSX." },
              { id: "C", text: "Because web browsers will refuse to install React without a special physical key", explanationIfWrong: "React is an open source library loaded in standard JS." },
              { id: "D", text: "Because React is an obsolete language replaced by assembly", explanationIfWrong: "React is one of the most widely used web libraries in the world." }
            ],
            correctAnswer: "A",
            explanationNote: "React abstracts and streamlines DOM rendering, but the underlying mechanisms (HTTP, JSON, events, component lifecycles) are rooted in web fundamentals."
          },
          {
            id: "q-0.6-5-v2",
            question: "What primary challenge of building complex SPAs with vanilla JavaScript does React address starting in Part 1?",
            options: [
              { id: "A", text: "It replaces tedious, imperative manual DOM manipulation with a declarative, component-driven architecture", explanationIfWrong: "" },
              { id: "B", text: "It prevents users from using the internet", explanationIfWrong: "React applications are built for the internet." },
              { id: "C", text: "It converts HTML into Python backend scripts", explanationIfWrong: "React is a frontend user interface library." },
              { id: "D", text: "It restricts web pages to 10 characters of text", explanationIfWrong: "React scales to massive platforms like Facebook and Netflix." }
            ],
            correctAnswer: "A",
            explanationNote: "React replaces repetitive imperative DOM calls (createElement, appendChild) with a declarative component model that automatically synchronizes the UI with state."
          }
        ]
      }
    ]
  }
];

// Helper to retrieve or select active questions for a given level with duplicate prevention
export const getActiveQuestionsForLevelFullstackPart0 = (
  section: SectionContent,
  studentId: string,
  forceNewSet: boolean = false
): McqQuestion[] => {
  const historyKey = `dopilot_fullstack_part0_question_history_${studentId}`;
  const activeSetKey = `dopilot_fullstack_part0_active_questions_${section.id}_${studentId}`;

  if (!forceNewSet) {
    try {
      const saved = localStorage.getItem(activeSetKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === section.theoryBlocks.length) {
          return parsed;
        }
      }
    } catch {}
  }

  let seenIds: string[] = [];
  try {
    const historySaved = localStorage.getItem(historyKey);
    if (historySaved) {
      seenIds = JSON.parse(historySaved);
    }
  } catch {}

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

export const getActiveQuestionsForLevel = getActiveQuestionsForLevelFullstackPart0;

export const getLevelAttemptCountFullstackPart0 = (sectionId: string, studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_fullstack_attempt_${sectionId}_${studentId}`);
    return saved ? Number(saved) : 1;
  } catch {
    return 1;
  }
};

export const setLevelAttemptCountFullstackPart0 = (sectionId: string, studentId: string, count: number): void => {
  try {
    localStorage.setItem(`dopilot_fullstack_attempt_${sectionId}_${studentId}`, String(count));
  } catch {}
};

export const getConsecutiveFailuresFullstackPart0 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_fullstack_consecutive_failures_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const getConsecutiveFailedLevelsFullstackPart0 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_fullstack_failed_levels_streak_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const recordLevelAttemptResultFullstackPart0 = (
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
  const currentAttempt = getLevelAttemptCountFullstackPart0(sectionId, studentId);

  if (isPassed) {
    try {
      localStorage.setItem(`dopilot_fullstack_failed_levels_streak_${studentId}`, '0');
      localStorage.setItem(`dopilot_fullstack_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_fullstack_attempt_${sectionId}_${studentId}`, '1');
      localStorage.removeItem(`dopilot_fullstack_locked_${studentId}`);
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
      setLevelAttemptCountFullstackPart0(sectionId, studentId, 2);
      const streak = getConsecutiveFailedLevelsFullstackPart0(studentId);

      return {
        isPassed: false,
        attemptCount: 1,
        isSecondFailureInLevel: false,
        consecutiveFailedLevels: streak,
        isLocked: false
      };
    } else {
      const prevStreak = getConsecutiveFailedLevelsFullstackPart0(studentId);
      const newStreak = prevStreak + 1;
      const isLocked = newStreak >= 3;

      try {
        localStorage.setItem(`dopilot_fullstack_failed_levels_streak_${studentId}`, String(newStreak));
        localStorage.setItem(`dopilot_fullstack_consecutive_failures_${studentId}`, String(newStreak));
        if (isLocked) {
          localStorage.setItem(`dopilot_fullstack_locked_${studentId}`, 'true');
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

export const resetConsecutiveFailuresFullstackPart0 = (studentId: string): void => {
  try {
    localStorage.setItem(`dopilot_fullstack_consecutive_failures_${studentId}`, '0');
    localStorage.setItem(`dopilot_fullstack_failed_levels_streak_${studentId}`, '0');
    localStorage.removeItem(`dopilot_fullstack_locked_${studentId}`);
  } catch {}
};
