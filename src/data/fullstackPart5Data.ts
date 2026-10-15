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

export const FULLSTACK_PART_5_SECTIONS: SectionContent[] = [
  {
    id: "5-1-login-localstorage-tokens",
    number: "5.1",
    title: "Login in Frontend & LocalStorage Persistence",
    subtitle: "Send credentials to backend login endpoint, save JWT tokens in browser localStorage, and rehydrate user session on page refresh.",
    readTime: "12 min",
    objectives: [
      "Send POST requests with credentials to /api/login from a React frontend",
      "Persist user authentication state and JWT token using window.localStorage",
      "Use useEffect on initial app render to restore logged-in sessions automatically",
      "Attach JWT bearer tokens to outbound Axios HTTP service headers",
      "Implement a clear session / logout function that purges localStorage",
      "Display username and logout button when a session is active"
    ],
    theoryBlocks: [
      {
        heading: "Handling Login in React Frontend",
        text: "The frontend captures username and password from controlled form inputs and submits them to the backend login service via Axios.",
        codeSnippet: `const handleLogin = async (event) => {\n  event.preventDefault();\n  try {\n    const user = await loginService.login({ username, password });\n    setUser(user);\n    setUsername('');\n    setPassword('');\n  } catch (exception) {\n    setErrorMessage('Wrong credentials');\n  }\n};`,
        mcq: {
          id: "q-5.1-0-v1",
          question: "Why must event.preventDefault() be called inside the form's onSubmit handler?",
          options: [
            { id: "A", text: "To prevent the default browser behavior of submitting the form and reloading the entire page", explanationIfWrong: "In single page apps, preventing the native page reload preserves JavaScript state." },
            { id: "B", text: "Because React throws an error if forms are submitted without preventDefault()", explanationIfWrong: "React does not throw an error; the browser simply performs a full page reload." },
            { id: "C", text: "To encrypt the username and password before sending", explanationIfWrong: "preventDefault only stops page navigation; it does not encrypt data." },
            { id: "D", text: "To automatically clear all input fields in the DOM", explanationIfWrong: "Input fields are cleared via state setters (e.g. setUsername(''))." }
          ],
          correctAnswer: "A",
          explanationNote: "Calling event.preventDefault() stops the standard browser behavior of reloading the page on form submission, allowing React to handle authentication asynchronously."
        },
        retestMcq: {
          id: "q-5.1-0-v2",
          question: "What should the frontend do when the backend rejects login with HTTP 401 Unauthorized?",
          options: [
            { id: "A", text: "Catch the error in a try/catch block and display a user-friendly error notification", explanationIfWrong: "Catching the rejection allows displaying an informative feedback banner to the user." },
            { id: "B", text: "Automatically redirect the browser to the backend database server", explanationIfWrong: "Browsers should never connect directly to database servers." },
            { id: "C", text: "Crash the React application with an unhandled runtime exception", explanationIfWrong: "Errors should be handled gracefully, not crash the UI." },
            { id: "D", text: "Save an empty string as a valid JWT token in state", explanationIfWrong: "Invalid logins must not update authenticated user state." }
          ],
          correctAnswer: "A",
          explanationNote: "Catching Axios errors in a try/catch block allows the component to display a friendly message ('Wrong username or password') without crashing the app."
        }
      },
      {
        heading: "Persisting Session in localStorage",
        text: "The browser's window.localStorage stores key-value string pairs that survive page refreshes, keeping the user logged in.",
        codeSnippet: `// Save user object as JSON string:\nwindow.localStorage.setItem(\n  'loggedNoteappUser', JSON.stringify(user)\n);\n\n// Read on page refresh:\nconst loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');`,
        mcq: {
          id: "q-5.1-1-v1",
          question: "Why must the user object be serialized with JSON.stringify() before calling localStorage.setItem()?",
          options: [
            { id: "A", text: "localStorage can only store string values; storing raw objects converts them into the useless string '[object Object]'", explanationIfWrong: "localStorage only accepts DOMString values, so objects must be converted to JSON strings." },
            { id: "B", text: "Because JSON.stringify() cryptographically signs the object with an SHA-256 hash", explanationIfWrong: "JSON.stringify serializes objects to strings; it does not sign or encrypt data." },
            { id: "C", text: "Because browsers throw a syntax error if objects are passed to localStorage", explanationIfWrong: "Browsers call toString() implicitly, turning objects into '[object Object]'." },
            { id: "D", text: "To compress the data to less than 1 kilobyte", explanationIfWrong: "JSON.stringify formats data as plain text, not compression." }
          ],
          correctAnswer: "A",
          explanationNote: "localStorage only stores strings. Storing a JavaScript object without JSON.stringify results in '[object Object]', losing all stored properties."
        },
        retestMcq: {
          id: "q-5.1-1-v2",
          question: "How do you deserialize a stored JSON string back into a JavaScript object when reading from localStorage?",
          options: [
            { id: "A", text: "JSON.parse(window.localStorage.getItem('loggedNoteappUser'))", explanationIfWrong: "JSON.parse parses the stored string back into a usable JavaScript object." },
            { id: "B", text: "window.localStorage.getItem('loggedNoteappUser').toObject()", explanationIfWrong: "Strings do not have a .toObject() method in JavaScript." },
            { id: "C", text: "Object.fromEntries(window.localStorage.getItem('loggedNoteappUser'))", explanationIfWrong: "Object.fromEntries expects an iterable of key-value pairs, not a JSON string." },
            { id: "D", text: "new User(window.localStorage.getItem('loggedNoteappUser'))", explanationIfWrong: "JSON.parse is the standard deserializer." }
          ],
          correctAnswer: "A",
          explanationNote: "JSON.parse() reconstructs the JavaScript object from the serialized JSON string retrieved from localStorage."
        }
      },
      {
        heading: "Restoring User Session on Mount",
        text: "A useEffect hook with an empty dependency array runs once when the app mounts, checking localStorage to restore an existing session.",
        codeSnippet: `useEffect(() => {\n  const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');\n  if (loggedUserJSON) {\n    const user = JSON.parse(loggedUserJSON);\n    setUser(user);\n    noteService.setToken(user.token);\n  }\n}, []);`,
        mcq: {
          id: "q-5.1-2-v1",
          question: "Why is the dependency array [] passed as the second argument to useEffect when restoring the user session?",
          options: [
            { id: "A", text: "To ensure the effect runs exactly once when the component is initially mounted onto the DOM", explanationIfWrong: "An empty dependency array causes the effect to run solely on initial component mount." },
            { id: "B", text: "To make the effect run on every single component re-render", explanationIfWrong: "Omitting the array runs on every render; an empty array runs only once on mount." },
            { id: "C", text: "To prevent the component from ever unmounting", explanationIfWrong: "Dependency arrays control execution timing, not unmounting lifecycle." },
            { id: "D", text: "To tell React that the effect returns a Promise", explanationIfWrong: "useEffect callbacks cannot return Promises." }
          ],
          correctAnswer: "A",
          explanationNote: "Passing [] ensures the session restoration effect runs only once when the application first loads in the browser."
        },
        retestMcq: {
          id: "q-5.1-2-v2",
          question: "Why must noteService.setToken(user.token) be called in addition to setUser(user) during session rehydration?",
          options: [
            { id: "A", text: "To configure the Axios service module with the restored token for subsequent authenticated API requests", explanationIfWrong: "The service module needs the token string to build Authorization headers." },
            { id: "B", text: "Because React state cannot be accessed by any other component", explanationIfWrong: "State can be passed via props or context; service modules need the token directly." },
            { id: "C", text: "To delete expired notes from the database", explanationIfWrong: "setToken merely sets an in-memory string variable in the service module." },
            { id: "D", text: "To re-render the browser's address bar", explanationIfWrong: "setToken does not interact with the browser URL." }
          ],
          correctAnswer: "A",
          explanationNote: "The API service module maintains its own in-memory token variable used for Axios Authorization headers; restoring user state alone does not update the service."
        }
      },
      {
        heading: "Configuring Axios Service Authorization",
        text: "The API service module stores the bearer token in a closure variable and attaches it to request config headers for protected routes.",
        codeSnippet: `// services/notes.js\nlet token = null;\nconst setToken = newToken => {\n  token = \`Bearer \${newToken}\`;\n};\nconst create = async newObject => {\n  const config = { headers: { Authorization: token } };\n  const response = await axios.post(baseUrl, newObject, config);\n  return response.data;\n};`,
        mcq: {
          id: "q-5.1-3-v1",
          question: "How does the create function authenticate the POST request with the backend?",
          options: [
            { id: "A", text: "It includes an Authorization header with 'Bearer <token>' inside the Axios config object", explanationIfWrong: "Axios sends custom headers via the config object in request methods." },
            { id: "B", text: "It appends the token as a URL query parameter '?token=...'", explanationIfWrong: "Bearer tokens are passed in the Authorization header, not URL query params." },
            { id: "C", text: "It injects the token into every field of the request payload body", explanationIfWrong: "Tokens belong in HTTP headers, not mixed into domain payload data." },
            { id: "D", text: "It establishes an SSH tunnel with the server", explanationIfWrong: "Standard HTTP headers over TLS/HTTPS are used." }
          ],
          correctAnswer: "A",
          explanationNote: "Axios accepts a configuration object containing a headers property where the Authorization: Bearer <token> header is declared."
        },
        retestMcq: {
          id: "q-5.1-3-v2",
          question: "What happens if a protected endpoint is called with noteService.create() before setToken() has been called?",
          options: [
            { id: "A", text: "The request is sent without a valid token and the backend responds with HTTP 401 Unauthorized", explanationIfWrong: "Without setting the token, the Authorization header is missing or null, resulting in 401." },
            { id: "B", text: "Axios automatically generates a mock admin token", explanationIfWrong: "Axios never invents authentication credentials." },
            { id: "C", text: "The browser freezes until the user enters their password", explanationIfWrong: "Browsers do not freeze; standard HTTP 401 errors are returned." },
            { id: "D", text: "The backend creates the resource under an anonymous guest account", explanationIfWrong: "Protected routes reject unauthenticated requests." }
          ],
          correctAnswer: "A",
          explanationNote: "If token is null, the Authorization header is omitted or invalid, causing the backend to reject the request with HTTP 401 Unauthorized."
        }
      },
      {
        heading: "Implementing User Logout",
        text: "Logging out simply requires removing the stored user from localStorage and resetting the React user state to null.",
        codeSnippet: `const handleLogout = () => {\n  window.localStorage.removeItem('loggedNoteappUser');\n  setUser(null);\n  noteService.setToken(null);\n};`,
        mcq: {
          id: "q-5.1-4-v1",
          question: "Why doesn't logging out with stateless JWTs require making an HTTP request to the backend?",
          options: [
            { id: "A", text: "Because the server does not store session state; destroying the client-side token in localStorage and React state effectively ends the session", explanationIfWrong: "Stateless authentication requires no server session cleanup." },
            { id: "B", text: "Because Express automatically listens for mouse clicks on logout buttons", explanationIfWrong: "Servers do not listen for client DOM events." },
            { id: "C", text: "Because the browser deletes all cookies when the user moves the mouse", explanationIfWrong: "localStorage persists until explicitly cleared." },
            { id: "D", text: "Because JWT tokens are physically stored inside the computer's CPU cache", explanationIfWrong: "JWTs are strings stored in browser storage." }
          ],
          correctAnswer: "A",
          explanationNote: "Because the backend is stateless and maintains no server-side session records, discarding the token on the client completely prevents further authenticated requests."
        },
        retestMcq: {
          id: "q-5.1-4-v2",
          question: "Which window.localStorage method removes a specific stored item by its key name?",
          options: [
            { id: "A", text: "window.localStorage.removeItem('loggedNoteappUser')", explanationIfWrong: "removeItem(key) deletes the specified key and its associated value." },
            { id: "B", text: "window.localStorage.delete('loggedNoteappUser')", explanationIfWrong: "Storage interfaces use removeItem(), not delete()." },
            { id: "C", text: "window.localStorage.clearItem('loggedNoteappUser')", explanationIfWrong: "The method is removeItem; clear() clears all keys." },
            { id: "D", text: "delete window.localStorage['loggedNoteappUser']", explanationIfWrong: "While possible, removeItem() is the official standard Storage API method." }
          ],
          correctAnswer: "A",
          explanationNote: "window.localStorage.removeItem(key) is the standard method for removing an entry from local storage."
        }
      },
      {
        heading: "Security Considerations of localStorage",
        text: "While convenient, localStorage is accessible to any JavaScript running on the page, making it vulnerable if the site suffers from Cross-Site Scripting (XSS).",
        codeSnippet: `// ⚠️ XSS vulnerability risk:\n// If malicious third-party script executes on the page,\n// it can steal the token:\nconst stolen = window.localStorage.getItem('loggedNoteappUser');\n// Alternative production defense: httpOnly secure cookies`,
        mcq: {
          id: "q-5.1-5-v1",
          question: "What is the primary security risk associated with storing authentication tokens in browser localStorage?",
          options: [
            { id: "A", text: "Tokens stored in localStorage are vulnerable to theft if the application is compromised by a Cross-Site Scripting (XSS) vulnerability", explanationIfWrong: "Any script running on the origin can read localStorage." },
            { id: "B", text: "localStorage is transmitted automatically to all third-party tracking domains", explanationIfWrong: "localStorage follows the Same-Origin Policy and cannot be read by other domains." },
            { id: "C", text: "localStorage values are deleted whenever the user opens a new browser tab", explanationIfWrong: "localStorage persists across all tabs and browser restarts." },
            { id: "D", text: "localStorage cannot store more than 10 bytes of data", explanationIfWrong: "localStorage typically allows up to 5MB of storage." }
          ],
          correctAnswer: "A",
          explanationNote: "Because JavaScript can read localStorage, an XSS vulnerability allowing injected scripts can read and exfiltrate stored tokens."
        },
        retestMcq: {
          id: "q-5.1-5-v2",
          question: "What cookie attribute prevents client-side JavaScript from accessing session cookies, mitigating token theft via XSS?",
          options: [
            { id: "A", text: "httpOnly", explanationIfWrong: "The httpOnly flag prevents client JavaScript from reading document.cookie." },
            { id: "B", text: "no-script", explanationIfWrong: "no-script is an HTML tag, not a cookie attribute." },
            { id: "C", text: "read-only-client", explanationIfWrong: "The standard browser cookie flag is httpOnly." },
            { id: "D", text: "same-site-strict-only", explanationIfWrong: "SameSite protects against CSRF; httpOnly protects against script access (XSS)." }
          ],
          correctAnswer: "A",
          explanationNote: "Cookies marked with the httpOnly flag cannot be accessed by client-side JavaScript (e.g. document.cookie), protecting them from XSS exfiltration."
        }
      }
    ]
  },
  {
    id: "5-2-toggleable-components-refs",
    number: "5.2",
    title: "Toggleable Components & React Refs",
    subtitle: "Build reusable toggleable containers, utilize props.children, and expose imperative child methods using forwardRef and useImperativeHandle.",
    readTime: "13 min",
    objectives: [
      "Create reusable Togglable container components for showing and hiding UI forms",
      "Use props.children to render nested elements inside wrapper components",
      "Understand why React components typically communicate via top-down props",
      "Create component references using the useRef hook",
      "Expose parent-callable functions (like toggleVisibility) using useImperativeHandle",
      "Wrap components with forwardRef to pass ref handles across component boundaries"
    ],
    theoryBlocks: [
      {
        heading: "Conditional Visibility Pattern",
        text: "A component can control its own visibility by toggling a boolean state and rendering different buttons or content blocks accordingly.",
        codeSnippet: `const [visible, setVisible] = useState(false);\nconst hideWhenVisible = { display: visible ? 'none' : '' };\nconst showWhenVisible = { display: visible ? '' : 'none' };\n\nreturn (\n  <div>\n    <div style={hideWhenVisible}>\n      <button onClick={() => setVisible(true)}>Create Note</button>\n    </div>\n    <div style={showWhenVisible}>\n      <NoteForm />\n      <button onClick={() => setVisible(false)}>Cancel</button>\n    </div>\n  </div>\n);`,
        mcq: {
          id: "q-5.2-0-v1",
          question: "What is the advantage of using inline style { display: visible ? '' : 'none' } compared to conditional rendering {visible && <NoteForm />}?",
          options: [
            { id: "A", text: "The component remains mounted in the DOM, preserving any draft form input state even when hidden", explanationIfWrong: "Hiding with CSS retains component mount state, whereas conditional unmounting resets state." },
            { id: "B", text: "It prevents the browser from using any RAM", explanationIfWrong: "CSS display property has no measurable impact on RAM consumption." },
            { id: "C", text: "It causes React to compile the component to static HTML", explanationIfWrong: "React continues to manage virtual DOM for mounted components." },
            { id: "D", text: "It forces the backend database to index the form fields", explanationIfWrong: "CSS display rules only affect browser presentation." }
          ],
          correctAnswer: "A",
          explanationNote: "Toggling display: none leaves the component mounted in the DOM, keeping internal state (such as text typed into inputs) intact."
        },
        retestMcq: {
          id: "q-5.2-0-v2",
          question: "When is true conditional unmounting ({visible && <NoteForm />}) preferable over CSS display: none?",
          options: [
            { id: "A", text: "When you want the component to reset its internal state completely and run its mount/cleanup lifecycle effects when toggled", explanationIfWrong: "Unmounting resets all component state and runs cleanup hooks." },
            { id: "B", text: "When you want the form inputs to retain their text forever", explanationIfWrong: "Unmounting destroys internal state; CSS display: none preserves it." },
            { id: "C", text: "When the application does not have access to CSS stylesheets", explanationIfWrong: "Inline styles work without external CSS files." },
            { id: "D", text: "When testing is forbidden", explanationIfWrong: "Both approaches are testable." }
          ],
          correctAnswer: "A",
          explanationNote: "Conditional unmounting ({visible && <Child />}) completely tears down the component, resetting all state and running useEffect cleanup functions."
        }
      },
      {
        heading: "Component Encapsulation with props.children",
        text: "The special props.children prop allows components to act as generic wrappers, rendering whatever JSX is nested inside their opening and closing tags.",
        codeSnippet: `const Togglable = (props) => {\n  const [visible, setVisible] = useState(false);\n  return (\n    <div>\n      {visible && props.children}\n      <button onClick={() => setVisible(!visible)}>\n        {visible ? 'cancel' : props.buttonLabel}\n      </button>\n    </div>\n  );\n};`,
        mcq: {
          id: "q-5.2-1-v1",
          question: "What does props.children contain in a React component?",
          options: [
            { id: "A", text: "Any JSX elements or components nested between the opening and closing tags of that component", explanationIfWrong: "props.children is React's built-in mechanism for component composition." },
            { id: "B", text: "An array of all sub-packages installed in node_modules", explanationIfWrong: "props.children has nothing to do with npm packages." },
            { id: "C", text: "The parent component's database credentials", explanationIfWrong: "props only contain data explicitly passed in JSX." },
            { id: "D", text: "A list of child processes running in the Node.js runtime", explanationIfWrong: "props.children represents nested React virtual DOM nodes." }
          ],
          correctAnswer: "A",
          explanationNote: "React automatically passes whatever elements are nested inside <Togglable><Child /></Togglable> into props.children."
        },
        retestMcq: {
          id: "q-5.2-1-v2",
          question: "How can a developer use Togglable to wrap both a LoginForm and a NoteForm in different parts of an application?",
          options: [
            { id: "A", text: "<Togglable buttonLabel='login'><LoginForm /></Togglable> and <Togglable buttonLabel='new note'><NoteForm /></Togglable>", explanationIfWrong: "props.children makes Togglable reusable for any nested component." },
            { id: "B", text: "Togglable can only ever wrap one specific hardcoded component", explanationIfWrong: "props.children provides generic composition for any component." },
            { id: "C", text: "By rewriting the Togglable component source code in two separate files", explanationIfWrong: "Code duplication defeats the purpose of reusable wrapper components." },
            { id: "D", text: "By converting the components into React class components", explanationIfWrong: "Function components support props.children seamlessly." }
          ],
          correctAnswer: "A",
          explanationNote: "Using props.children makes Togglable fully reusable: any component nested inside will be toggled by the wrapper's button."
        }
      },
      {
        heading: "React Refs with useRef",
        text: "The useRef hook creates a persistent reference object whose .current property can hold a DOM node or an imperative component handle.",
        codeSnippet: `const noteFormRef = useRef();\n\n// Pass ref to component:\n<Togglable buttonLabel="new note" ref={noteFormRef}>\n  <NoteForm createNote={addNote} />\n</Togglable>`,
        mcq: {
          id: "q-5.2-2-v1",
          question: "How does mutating a ref's .current property differ from updating state with useState?",
          options: [
            { id: "A", text: "Mutating ref.current does NOT trigger a component re-render, whereas calling a state setter does", explanationIfWrong: "Refs persist values across renders without causing re-renders when updated." },
            { id: "B", text: "Refs can only store integer numbers, while state stores any type", explanationIfWrong: "Refs can hold any JavaScript value or DOM element reference." },
            { id: "C", text: "Refs are stored in browser localStorage automatically", explanationIfWrong: "Refs exist solely in React's component memory lifecycle." },
            { id: "D", text: "State updates are synchronous, while refs are always asynchronous", explanationIfWrong: "Mutating ref.current is immediate and synchronous." }
          ],
          correctAnswer: "A",
          explanationNote: "Updating ref.current does not cause the component to re-render, making refs ideal for imperative handles and tracking values across renders silently."
        },
        retestMcq: {
          id: "q-5.2-2-v2",
          question: "What is the initial value of noteFormRef.current when const noteFormRef = useRef() is initialized without arguments?",
          options: [
            { id: "A", text: "undefined", explanationIfWrong: "useRef() with no argument defaults .current to undefined." },
            { id: "B", text: "null", explanationIfWrong: "useRef(null) sets null, but useRef() without arguments initializes to undefined." },
            { id: "C", text: "0", explanationIfWrong: "useRef() does not default to 0." },
            { id: "D", text: "false", explanationIfWrong: "useRef() initializes to undefined unless an initial value is supplied." }
          ],
          correctAnswer: "A",
          explanationNote: "useRef() initializes .current to undefined (or the provided initial argument, such as useRef(null))."
        }
      },
      {
        heading: "forwardRef & useImperativeHandle",
        text: "forwardRef allows a component to receive a ref from its parent, and useImperativeHandle customizes the object exposed on ref.current.",
        codeSnippet: `const Togglable = forwardRef((props, refs) => {\n  const [visible, setVisible] = useState(false);\n  const toggleVisibility = () => setVisible(!visible);\n\n  useImperativeHandle(refs, () => ({\n    toggleVisibility\n  }));\n\n  return (/* ... */);\n});`,
        mcq: {
          id: "q-5.2-3-v1",
          question: "Why is forwardRef necessary when passing a ref to a custom function component?",
          options: [
            { id: "A", text: "By default, function components cannot receive the 'ref' attribute like native HTML elements; forwardRef explicitly accepts it as a second parameter", explanationIfWrong: "Regular function components do not accept ref in props; forwardRef passes it as (props, ref)." },
            { id: "B", text: "Because React only allows class components to have props", explanationIfWrong: "Function components receive props normally." },
            { id: "C", text: "To prevent the component from accessing window.localStorage", explanationIfWrong: "forwardRef is strictly a React component reference forwarding mechanism." },
            { id: "D", text: "To automatically convert CSS classes to Tailwind utilities", explanationIfWrong: "forwardRef has nothing to do with CSS styling." }
          ],
          correctAnswer: "A",
          explanationNote: "Standard function components do not expose a ref attribute. Wrapping with forwardRef((props, ref) => ...) allows the parent to attach a ref."
        },
        retestMcq: {
          id: "q-5.2-3-v2",
          question: "What function does useImperativeHandle serve inside a component wrapped with forwardRef?",
          options: [
            { id: "A", text: "It defines which functions or values are exposed to the parent component via the ref's .current property", explanationIfWrong: "useImperativeHandle customizes the imperative API exposed on ref.current." },
            { id: "B", text: "It replaces all Redux reducers with a GraphQL query", explanationIfWrong: "It is a React Hook for component ref customization." },
            { id: "C", text: "It prevents the child component from rendering any HTML", explanationIfWrong: "The component still returns JSX and renders normally." },
            { id: "D", text: "It forces the parent component to re-render every 500ms", explanationIfWrong: "It exposes functions; it does not set intervals." }
          ],
          correctAnswer: "A",
          explanationNote: "useImperativeHandle(ref, () => ({ ... })) allows the child component to expose specific callable methods (such as toggleVisibility) to the parent."
        }
      },
      {
        heading: "Closing Forms Automatically via Ref",
        text: "After a new note is successfully created, the parent component can call noteFormRef.current.toggleVisibility() to hide the form.",
        codeSnippet: `const addNote = async (noteObject) => {\n  noteFormRef.current.toggleVisibility();\n  const returnedNote = await noteService.create(noteObject);\n  setNotes(notes.concat(returnedNote));\n};`,
        mcq: {
          id: "q-5.2-4-v1",
          question: "How does calling noteFormRef.current.toggleVisibility() improve the user experience after creating a note?",
          options: [
            { id: "A", text: "It automatically closes the creation form so the user immediately sees the updated list without manually clicking cancel", explanationIfWrong: "Closing the form on successful submission streamlines workflow." },
            { id: "B", text: "It logs the user out of the application", explanationIfWrong: "It merely toggles the form's visibility." },
            { id: "C", text: "It deletes the newly created note from the database", explanationIfWrong: "The note was created and saved; this only adjusts UI visibility." },
            { id: "D", text: "It changes the browser theme from dark to light", explanationIfWrong: "It toggles the Togglable container's visibility state." }
          ],
          correctAnswer: "A",
          explanationNote: "Invoking toggleVisibility() via the ref collapses the creation form as soon as submission completes, providing immediate visual feedback."
        },
        retestMcq: {
          id: "q-5.2-4-v2",
          question: "Why should imperative ref methods be used sparingly in React applications?",
          options: [
            { id: "A", text: "React follows a declarative, unidirectional data-flow paradigm; excessive imperative ref manipulation makes code harder to reason about and debug", explanationIfWrong: "Declarative props and state are the core foundation of React; refs break standard data flow." },
            { id: "B", text: "Because calling a ref crashes the JavaScript V8 engine", explanationIfWrong: "Refs are standard JavaScript objects and execute safely." },
            { id: "C", text: "Because refs cannot be tested with Vitest or Jest", explanationIfWrong: "Refs can be tested and mocked." },
            { id: "D", text: "Because refs are removed in modern browsers", explanationIfWrong: "Refs are an official and permanent feature of React." }
          ],
          correctAnswer: "A",
          explanationNote: "React emphasizes declarative top-down data flow with props and state. Imperative methods should be reserved for cases like focus management and toggling UI overlays."
        }
      },
      {
        heading: "PropTypes for Component Validation",
        text: "The prop-types library validates that required props are passed to components with the correct types, warning developers in the console during development.",
        codeSnippet: `import PropTypes from 'prop-types';\n\nTogglable.propTypes = {\n  buttonLabel: PropTypes.string.isRequired\n};`,
        mcq: {
          id: "q-5.2-5-v1",
          question: "What happens if a required prop validated with PropTypes.string.isRequired is omitted when rendering a component in development?",
          options: [
            { id: "A", text: "React logs a descriptive warning in the browser console identifying the missing prop and component", explanationIfWrong: "PropTypes emit helpful console warnings during development." },
            { id: "B", text: "The browser immediately crashes with a Blue Screen of Death", explanationIfWrong: "PropTypes do not crash the operating system." },
            { id: "C", text: "The backend server deletes the database", explanationIfWrong: "PropTypes are purely client-side runtime validation checks." },
            { id: "D", text: "React automatically injects a random string value", explanationIfWrong: "React does not inject values; it prints a warning." }
          ],
          correctAnswer: "A",
          explanationNote: "In development mode, PropTypes checks prop types and prints detailed console warnings when required props are missing or have incorrect types."
        },
        retestMcq: {
          id: "q-5.2-5-v2",
          question: "Do PropTypes validations run in production builds of React applications?",
          options: [
            { id: "A", text: "No, PropTypes type-checking is stripped in production builds for performance optimization", explanationIfWrong: "Production bundles optimize away PropTypes checks to avoid runtime overhead." },
            { id: "B", text: "Yes, they run on every single frame in production", explanationIfWrong: "Running checks in production would degrade performance." },
            { id: "C", text: "Yes, and they display an alert box to end users if a prop is wrong", explanationIfWrong: "PropTypes never display alert boxes." },
            { id: "D", text: "PropTypes only run on mobile phones", explanationIfWrong: "PropTypes are platform-independent development checks." }
          ],
          correctAnswer: "A",
          explanationNote: "PropTypes are intended purely for development ergonomics; production builds strip or bypass these validations for performance."
        }
      }
    ]
  },
  {
    id: "5-3-form-handling-notifications",
    number: "5.3",
    title: "Forms, Submissions & Timed Notifications",
    subtitle: "Separate form components, manage localized state, handle asynchronous submissions, and design temporary auto-clearing feedback notifications.",
    readTime: "11 min",
    objectives: [
      "Separate form logic into standalone child components with localized state",
      "Pass submission handler callbacks from parent to child components",
      "Display temporary status notifications (success and error) with distinct colors",
      "Auto-dismiss notifications using setTimeout and state cleanup",
      "Handle HTTP 401 Unauthorized token expirations gracefully",
      "Implement optimistic UI updates vs server-confirmed updates"
    ],
    theoryBlocks: [
      {
        heading: "Separating Form Component State",
        text: "Extracting NoteForm into its own component keeps input state localized, preventing unnecessary re-renders of the parent App component on every keystroke.",
        codeSnippet: `const NoteForm = ({ createNote }) => {\n  const [newNote, setNewNote] = useState('');\n  const addNote = (event) => {\n    event.preventDefault();\n    createNote({ content: newNote, important: true });\n    setNewNote('');\n  };\n  return (/* form jsx */);\n};`,
        mcq: {
          id: "q-5.3-0-v1",
          question: "Why is it beneficial to keep the newNote input state inside NoteForm rather than at the top-level App component?",
          options: [
            { id: "A", text: "Typing into the input only re-renders NoteForm, preventing the entire App and notes list from re-rendering on every keystroke", explanationIfWrong: "Localizing state confines re-renders to the component that actually owns the data." },
            { id: "B", text: "Because React does not allow text state in the App component", explanationIfWrong: "State can exist anywhere, but localized state is far more performant and modular." },
            { id: "C", text: "To prevent child components from reading props", explanationIfWrong: "Props remain accessible regardless of state location." },
            { id: "D", text: "Because forms cannot submit if state is in App", explanationIfWrong: "Forms can submit regardless, but performance and modularity improve." }
          ],
          correctAnswer: "A",
          explanationNote: "Keeping input state local to NoteForm ensures only NoteForm re-renders as the user types, keeping the rest of the application performant and decoupled."
        },
        retestMcq: {
          id: "q-5.3-0-v2",
          question: "How does NoteForm send the newly created note data back up to the parent component?",
          options: [
            { id: "A", text: "By invoking a callback function passed down as a prop (e.g. createNote(noteObject))", explanationIfWrong: "Parent components pass handler functions down as props to receive data from children." },
            { id: "B", text: "By modifying the parent component's variables directly through the window object", explanationIfWrong: "Global window mutations violate React's component encapsulation." },
            { id: "C", text: "By sending an HTTP request directly to the parent's IP address", explanationIfWrong: "Parent and child components live in the same browser memory space." },
            { id: "D", text: "By writing to a temporary file on the user's hard drive", explanationIfWrong: "React components communicate in memory via props and callbacks." }
          ],
          correctAnswer: "A",
          explanationNote: "In React's unidirectional data flow, parents pass callback functions via props, which children call with arguments to pass data back up."
        }
      },
      {
        heading: "Timed Feedback Notifications",
        text: "User actions should produce temporary feedback banners that automatically disappear after a few seconds using setTimeout.",
        codeSnippet: `const notify = (message, type = 'info') => {\n  setNotification({ message, type });\n  setTimeout(() => {\n    setNotification(null);\n  }, 5000);\n};`,
        mcq: {
          id: "q-5.3-1-v1",
          question: "How does the notify helper automatically clear the notification banner after 5 seconds?",
          options: [
            { id: "A", text: "setTimeout(() => setNotification(null), 5000); schedules a state reset to null after 5,000 milliseconds", explanationIfWrong: "setTimeout schedules asynchronous code to run after a specified delay." },
            { id: "B", text: "The browser automatically deletes HTML elements with class 'notification' after 5 seconds", explanationIfWrong: "Browsers do not automatically delete elements based on class names." },
            { id: "C", text: "By executing an infinite loop that pauses JavaScript for 5 seconds", explanationIfWrong: "Synchronous blocking freezes the browser thread and should never be used." },
            { id: "D", text: "By refreshing the web page automatically", explanationIfWrong: "Page reloads disrupt single-page app user experience." }
          ],
          correctAnswer: "A",
          explanationNote: "setTimeout queues a function call to setNotification(null) after 5000ms, triggering a re-render that removes the notification banner from the DOM."
        },
        retestMcq: {
          id: "q-5.3-1-v2",
          question: "What CSS technique allows a single Notification component to render green for success and red for errors?",
          options: [
            { id: "A", text: "Conditionally applying CSS class names or inline colors based on notification.type (e.g. type === 'error' ? 'text-red-400' : 'text-emerald-400')", explanationIfWrong: "Dynamic class names or styles adapt the banner's appearance to the message severity." },
            { id: "B", text: "By creating two entirely separate React applications", explanationIfWrong: "A single component with conditional styling handles both cases cleanly." },
            { id: "C", text: "By forcing the monitor to change physical color calibration", explanationIfWrong: "Monitors display whatever colors CSS renders." },
            { id: "D", text: "By asking the user to press a color button", explanationIfWrong: "The styling should automatically reflect message type." }
          ],
          correctAnswer: "A",
          explanationNote: "Conditionally applying CSS classes or color styles according to notification.type allows a single component to cleanly display both success and error styles."
        }
      },
      {
        heading: "Handling Expired Token Errors",
        text: "When an API request fails with HTTP 401 Unauthorized due to an expired token, the frontend should clear the stale session and prompt re-login.",
        codeSnippet: `try {\n  await noteService.create(noteObject);\n} catch (error) {\n  if (error.response && error.response.status === 401) {\n    handleLogout();\n    notify('Session expired. Please log in again.', 'error');\n  }\n}`,
        mcq: {
          id: "q-5.3-2-v1",
          question: "Why should the client call handleLogout() when a request returns HTTP 401 Unauthorized?",
          options: [
            { id: "A", text: "Because the stored token has expired or become invalid; purging stale session data allows the user to log in cleanly with fresh credentials", explanationIfWrong: "Purging invalid credentials resets the UI and prompts fresh authentication." },
            { id: "B", text: "Because HTTP 401 means the user's hard drive is full", explanationIfWrong: "401 specifically means Unauthorized credentials." },
            { id: "C", text: "To delete the user's account permanently from MongoDB Atlas", explanationIfWrong: "Logging out does not delete database accounts." },
            { id: "D", text: "Because browsers throw an unrecoverable exception if a 401 token remains in memory", explanationIfWrong: "Browsers handle 401 normally; clearing is for user experience." }
          ],
          correctAnswer: "A",
          explanationNote: "When a token expires, subsequent requests will continuously fail. Calling handleLogout() purges the stale token and renders the login form for the user."
        },
        retestMcq: {
          id: "q-5.3-2-v2",
          question: "Where in the Axios error object can you inspect the HTTP status code returned by the server?",
          options: [
            { id: "A", text: "error.response.status", explanationIfWrong: "Axios encapsulates the server HTTP response in error.response, with status as a number." },
            { id: "B", text: "error.codeNumber", explanationIfWrong: "Axios uses error.response.status for HTTP status codes." },
            { id: "C", text: "error.header.code", explanationIfWrong: "error.response.status is the correct Axios property." },
            { id: "D", text: "error.statusTextOnly", explanationIfWrong: "status is a numeric code (e.g. 401, 404, 500)." }
          ],
          correctAnswer: "A",
          explanationNote: "When the server responds with a status code outside the 2xx range, Axios populates error.response.status with the numerical HTTP status code."
        }
      },
      {
        heading: "Updating State with Concatenation",
        text: "State arrays must be updated immutably using array.concat() or the spread operator [...notes, newNote], never array.push().",
        codeSnippet: `// ✅ IMMUTABLE:\nsetNotes(notes.concat(savedNote));\n// or\nsetNotes([...notes, savedNote]);\n\n// ❌ NEVER MUTATE DIRECTLY:\nnotes.push(savedNote); // React won't detect the change!`,
        mcq: {
          id: "q-5.3-3-v1",
          question: "Why does calling notes.push(savedNote) fail to trigger a re-render in React?",
          options: [
            { id: "A", text: "push() mutates the existing array in place without creating a new reference; React uses reference equality (Object.is) to detect state changes", explanationIfWrong: "React checks whether state !== prevState by reference identity, so mutations are ignored." },
            { id: "B", text: "Because JavaScript does not allow push() on arrays inside components", explanationIfWrong: "push is standard JavaScript, but mutating state directly bypasses React's render engine." },
            { id: "C", text: "Because push() automatically converts all elements to strings", explanationIfWrong: "push preserves item types; the issue is reference identity." },
            { id: "D", text: "Because React only re-renders when numbers change", explanationIfWrong: "React re-renders on any state update that produces a new reference." }
          ],
          correctAnswer: "A",
          explanationNote: "React compares old and new state references. Mutating an array with push() keeps the same reference, so React concludes nothing changed and skips re-rendering."
        },
        retestMcq: {
          id: "q-5.3-3-v2",
          question: "How should an item be removed from a state array immutably when a note is deleted?",
          options: [
            { id: "A", text: "setNotes(notes.filter(note => note.id !== idToDelete))", explanationIfWrong: "filter() returns a brand-new array excluding the deleted item." },
            { id: "B", text: "notes.splice(notes.indexOf(idToDelete), 1)", explanationIfWrong: "splice() mutates the original array in place and should not be used on state." },
            { id: "C", text: "delete notes[idToDelete]", explanationIfWrong: "delete leaves an undefined hole in the array and mutates it." },
            { id: "D", text: "setNotes([]) then reload the page", explanationIfWrong: "Reloading defeats the purpose of client-side reactive state updates." }
          ],
          correctAnswer: "A",
          explanationNote: "Array.prototype.filter() creates and returns a new array containing only elements that satisfy the predicate, adhering to React's immutability requirement."
        }
      },
      {
        heading: "Sorting Displayed Lists",
        text: "Lists can be sorted prior to rendering using array.slice().sort((a, b) => b.likes - a.likes) to maintain ranking without mutating original state.",
        codeSnippet: `// Sort blogs descending by likes:\nconst sortedBlogs = blogs.slice().sort((a, b) => b.likes - a.likes);\n\nreturn (\n  <div>\n    {sortedBlogs.map(blog => (\n      <Blog key={blog.id} blog={blog} />\n    ))}\n  </div>\n);`,
        mcq: {
          id: "q-5.3-4-v1",
          question: "Why should blogs.slice() or [...blogs] be called before calling .sort() on a state array?",
          options: [
            { id: "A", text: ".sort() mutates the array in place; copying with slice() or spread prevents direct mutation of the underlying React state array", explanationIfWrong: "Array.prototype.sort mutates the array it is called on; shallow copying first protects state." },
            { id: "B", text: "Because .sort() throws an error if called on arrays with more than 3 elements", explanationIfWrong: ".sort works on arrays of any length." },
            { id: "C", text: "To reverse the list order automatically", explanationIfWrong: "slice() copies the array in the same order." },
            { id: "D", text: "To convert all blog likes into strings", explanationIfWrong: "Copying preserves object properties and types." }
          ],
          correctAnswer: "A",
          explanationNote: "JavaScript's sort() sorts arrays in place, mutating them. Calling slice() or [...blogs] creates a shallow copy first, preserving state immutability."
        },
        retestMcq: {
          id: "q-5.3-4-v2",
          question: "What comparator function sorts items in descending order of their 'likes' property?",
          options: [
            { id: "A", text: "(a, b) => b.likes - a.likes", explanationIfWrong: "Subtracting a from b produces descending order (highest first)." },
            { id: "B", text: "(a, b) => a.likes - b.likes", explanationIfWrong: "a.likes - b.likes sorts in ascending order (lowest first)." },
            { id: "C", text: "(a, b) => a.likes === b.likes", explanationIfWrong: "Comparators must return positive, negative, or zero numbers." },
            { id: "D", text: "(a, b) => a.likes + b.likes", explanationIfWrong: "Adding likes does not produce a valid comparison delta." }
          ],
          correctAnswer: "A",
          explanationNote: "(a, b) => b.likes - a.likes returns a positive number if b > a, placing the item with more likes before the item with fewer likes (descending)."
        }
      },
      {
        heading: "Confirmation Dialogs Before Deletion",
        text: "Accidental deletions should be guarded with browser confirmation modals using window.confirm() before dispatching delete API calls.",
        codeSnippet: `const handleDelete = async (blog) => {\n  const ok = window.confirm(\`Remove blog \${blog.title} by \${blog.author}?\`);\n  if (ok) {\n    await blogService.remove(blog.id);\n    setBlogs(blogs.filter(b => b.id !== blog.id));\n  }\n};`,
        mcq: {
          id: "q-5.3-5-v1",
          question: "What does window.confirm(message) return when the user clicks 'OK'?",
          options: [
            { id: "A", text: "true", explanationIfWrong: "window.confirm returns true if the user clicks OK, and false if they click Cancel." },
            { id: "B", text: "The string 'confirmed'", explanationIfWrong: "confirm returns a boolean, not a string." },
            { id: "C", text: "undefined", explanationIfWrong: "confirm returns a boolean indicating user choice." },
            { id: "D", text: "A Promise resolving to null", explanationIfWrong: "window.confirm is a synchronous browser modal returning a boolean." }
          ],
          correctAnswer: "A",
          explanationNote: "window.confirm() blocks execution and displays a modal dialog with OK and Cancel buttons, returning true if the user clicks OK and false otherwise."
        },
        retestMcq: {
          id: "q-5.3-5-v2",
          question: "What happens if the user clicks 'Cancel' in the window.confirm dialog in the handleDelete function above?",
          options: [
            { id: "A", text: "The function exits the if-block and neither the API delete call nor state update is executed", explanationIfWrong: "if (ok) evaluates to false, skipping deletion entirely." },
            { id: "B", text: "The server deletes the blog anyway", explanationIfWrong: "The delete call is inside the if-block and will not run." },
            { id: "C", text: "The browser tab immediately closes", explanationIfWrong: "Cancel simply returns false to the calling script." },
            { id: "D", text: "An error is logged to console.error", explanationIfWrong: "Clicking Cancel is a normal user decision; no error is thrown." }
          ],
          correctAnswer: "A",
          explanationNote: "Clicking Cancel causes window.confirm to return false, skipping the if (ok) block and safely aborting the deletion."
        }
      }
    ]
  },
  {
    id: "5-4-testing-react-components",
    number: "5.4",
    title: "Testing React Components: Vitest & RTL",
    subtitle: "Configure testing environments, render components with React Testing Library, and assert on rendered text and CSS visibility.",
    readTime: "13 min",
    objectives: [
      "Configure Vitest or Jest with @testing-library/react and @testing-library/jest-dom",
      "Render React components in isolation using render()",
      "Query DOM elements using screen.getByText() and screen.queryByText()",
      "Assert on rendered element presence, content, and visibility",
      "Verify that components hide detail blocks initially by default",
      "Debug rendered component output using screen.debug()"
    ],
    theoryBlocks: [
      {
        heading: "React Testing Library Philosophy",
        text: "React Testing Library (RTL) tests components from the user's perspective, querying visible text and accessible roles rather than internal implementation details.",
        codeSnippet: `import { render, screen } from '@testing-library/react';\nimport Note from './Note';\n\ntest('renders content', () => {\n  const note = { content: 'Component testing is done with RTL', important: true };\n  render(<Note note={note} />);\n  const element = screen.getByText('Component testing is done with RTL');\n  expect(element).toBeDefined();\n});`,
        mcq: {
          id: "q-5.4-0-v1",
          question: "What is the guiding principle of React Testing Library?",
          options: [
            { id: "A", text: "The more your tests resemble the way your software is used, the more confidence they can give you", explanationIfWrong: "Testing user interactions and visible text gives confidence that the UI works for real users." },
            { id: "B", text: "Tests should inspect private component state variables directly", explanationIfWrong: "RTL intentionally discourages testing private state; it focuses on visible output." },
            { id: "C", text: "Tests must verify the exact line numbers where functions are declared", explanationIfWrong: "Line numbers are implementation details irrelevant to users." },
            { id: "D", text: "Only backend server code should be tested with automated tools", explanationIfWrong: "Frontend UI component testing is essential for high quality." }
          ],
          correctAnswer: "A",
          explanationNote: "RTL focuses on testing what the end user sees and interacts with (text, buttons, inputs) rather than internal state or component instance details."
        },
        retestMcq: {
          id: "q-5.4-0-v2",
          question: "Why does React Testing Library discourage testing a component's internal state directly?",
          options: [
            { id: "A", text: "Testing internal state couples tests to implementation details, causing tests to break when refactoring even if user behavior remains correct", explanationIfWrong: "Testing user-visible behavior allows refactoring internal state freely without breaking tests." },
            { id: "B", text: "Because JavaScript variables are deleted during testing", explanationIfWrong: "Variables exist, but testing them directly creates fragile tests." },
            { id: "C", text: "Because React forbids reading state in development", explanationIfWrong: "State is accessible, but testing user outcomes is preferred." },
            { id: "D", text: "Because state updates are prohibited in modern React", explanationIfWrong: "State is standard; the goal is resilient testing." }
          ],
          correctAnswer: "A",
          explanationNote: "Testing implementation details (like state variable names) leads to brittle tests that break during refactoring, even when the component's visible behavior is identical."
        }
      },
      {
        heading: "Querying with screen.getByText",
        text: "The screen object provided by RTL offers query methods like getByText() to locate elements matching a string or regular expression.",
        codeSnippet: `render(<Note note={note} />);\n\n// Exact string match:\nconst element = screen.getByText('Component testing is done with RTL');\n\n// Substring regex match:\nconst element2 = screen.getByText(/testing is done/i);`,
        mcq: {
          id: "q-5.4-1-v1",
          question: "What happens if screen.getByText() cannot find any element matching the query?",
          options: [
            { id: "A", text: "It immediately throws an error and fails the test with a printout of the current DOM tree", explanationIfWrong: "getBy methods throw errors when elements are not found." },
            { id: "B", text: "It returns null and continues test execution", explanationIfWrong: "queryBy returns null; getBy throws an error." },
            { id: "C", text: "It returns undefined and waits 5 minutes", explanationIfWrong: "getBy evaluates immediately and throws if not found." },
            { id: "D", text: "It re-renders the component with placeholder text", explanationIfWrong: "Test queries never alter the rendered DOM." }
          ],
          correctAnswer: "A",
          explanationNote: "getBy* methods are designed to assert presence: if the element is not found, they immediately throw an error and print the DOM to help you debug."
        },
        retestMcq: {
          id: "q-5.4-1-v2",
          question: "When should screen.queryByText() be used instead of screen.getByText()?",
          options: [
            { id: "A", text: "When asserting that an element is NOT present in the DOM (e.g. expect(screen.queryByText('details')).toBeNull())", explanationIfWrong: "queryBy returns null when elements are missing, allowing .toBeNull() assertions." },
            { id: "B", text: "When querying buttons with images", explanationIfWrong: "Both work on text; queryBy is specifically for asserting absence." },
            { id: "C", text: "When the component is written in TypeScript", explanationIfWrong: "TypeScript supports all RTL query methods equally." },
            { id: "D", text: "When running tests in production", explanationIfWrong: "Tests do not run in production." }
          ],
          correctAnswer: "A",
          explanationNote: "Because getByText throws when an element is absent, queryByText (which returns null instead of throwing) must be used to verify that an element does NOT exist."
        }
      },
      {
        heading: "Debugging with screen.debug()",
        text: "Calling screen.debug() prints the formatted HTML of the rendered component to the test terminal, making visual inspection and query debugging simple.",
        codeSnippet: `render(<Note note={note} />);\n// Prints the entire rendered DOM:\nscreen.debug();\n\n// Prints a specific element:\nconst element = screen.getByText('Hello');\nscreen.debug(element);`,
        mcq: {
          id: "q-5.4-2-v1",
          question: "What is the primary purpose of calling screen.debug() in a component test?",
          options: [
            { id: "A", text: "To print the rendered HTML of the component to the console to see the current DOM structure while writing tests", explanationIfWrong: "screen.debug() outputs the formatted DOM for visual inspection." },
            { id: "B", text: "To automatically fix failing assertions in the test file", explanationIfWrong: "debug only prints DOM output; it does not modify code." },
            { id: "C", text: "To submit the component to the GitHub repository", explanationIfWrong: "screen.debug is a local test debugging utility." },
            { id: "D", text: "To speed up test runner execution", explanationIfWrong: "Printing output adds minor console overhead." }
          ],
          correctAnswer: "A",
          explanationNote: "screen.debug() prints the current DOM tree into the terminal, allowing developers to see exactly what HTML elements were rendered."
        },
        retestMcq: {
          id: "q-5.4-2-v2",
          question: "Can screen.debug() be passed a specific DOM element to inspect only a subset of the component tree?",
          options: [
            { id: "A", text: "Yes, passing an element like screen.debug(element) prints only that specific node and its children", explanationIfWrong: "screen.debug accepts an optional element argument for focused output." },
            { id: "B", text: "No, screen.debug() only ever prints the entire operating system console log", explanationIfWrong: "It accepts an optional element to limit output." },
            { id: "C", text: "No, passing arguments causes screen.debug to throw a TypeError", explanationIfWrong: "Passing a DOM element is fully supported." },
            { id: "D", text: "Yes, but only if the element is an <input>", explanationIfWrong: "It works on any HTML element node." }
          ],
          correctAnswer: "A",
          explanationNote: "Passing a DOM element to screen.debug(element) limits the terminal printout to that specific subtree, keeping terminal output clean."
        }
      },
      {
        heading: "Asserting on CSS Display and Visibility",
        text: "Custom matchers from @testing-library/jest-dom like toHaveStyle() verify that elements are hidden with display: none.",
        codeSnippet: `import '@testing-library/jest-dom';\n\ntest('at start the children are not displayed', () => {\n  const div = container.querySelector('.togglableContent');\n  expect(div).toHaveStyle('display: none');\n});`,
        mcq: {
          id: "q-5.4-3-v1",
          question: "Which Jest/Vitest matcher from @testing-library/jest-dom tests whether an element has a specific CSS style applied?",
          options: [
            { id: "A", text: "expect(element).toHaveStyle('display: none')", explanationIfWrong: "toHaveStyle checks computed and inline CSS styles on an element." },
            { id: "B", text: "expect(element).cssEquals('display: none')", explanationIfWrong: "cssEquals is not a valid jest-dom matcher." },
            { id: "C", text: "expect(element.style).toBe('none')", explanationIfWrong: "element.style is a CSSStyleDeclaration object, not a string." },
            { id: "D", text: "expect(element).isStyled('display', 'none')", explanationIfWrong: "The standard matcher is toHaveStyle." }
          ],
          correctAnswer: "A",
          explanationNote: "toHaveStyle('display: none') from @testing-library/jest-dom asserts that the element has the specified CSS properties applied."
        },
        retestMcq: {
          id: "q-5.4-3-v2",
          question: "What does expect(element).not.toHaveStyle('display: none') assert in a test?",
          options: [
            { id: "A", text: "That the element is visible because its display property is no longer 'none'", explanationIfWrong: "Negating with .not verifies that the style is absent or changed." },
            { id: "B", text: "That the element was completely deleted from memory", explanationIfWrong: "It asserts that the element does not have display: none; it remains in the DOM." },
            { id: "C", text: "That the browser has disabled CSS rendering", explanationIfWrong: "It tests element style rules, not browser engine state." },
            { id: "D", text: "That the component has crashed", explanationIfWrong: "It asserts proper visibility state." }
          ],
          correctAnswer: "A",
          explanationNote: "Using .not.toHaveStyle('display: none') asserts that the element has become visible (e.g. after clicking a toggle button)."
        }
      },
      {
        heading: "Testing Blog/Item Detail Toggle",
        text: "Component tests should verify that details like URLs and likes are hidden initially, and become visible when the user clicks 'view'.",
        codeSnippet: `test('renders title and author, but not url or likes by default', () => {\n  const blog = {\n    title: 'Testing React Apps',\n    author: 'Fullstack Developer',\n    url: 'https://fullstackopen.com',\n    likes: 10\n  };\n  render(<Blog blog={blog} />);\n  expect(screen.getByText(/Testing React Apps/)).toBeDefined();\n  expect(screen.queryByText(/https:\\/\\/fullstackopen.com/)).toBeNull();\n});`,
        mcq: {
          id: "q-5.4-4-v1",
          question: "When testing that details are omitted by default in a Blog component, which method should be used to check for the URL?",
          options: [
            { id: "A", text: "screen.queryByText() and assert .toBeNull()", explanationIfWrong: "queryByText returns null if not found, allowing .toBeNull() to pass." },
            { id: "B", text: "screen.getByText() and expect it to fail", explanationIfWrong: "getByText throws an error, causing the test suite itself to report a failure." },
            { id: "C", text: "window.alert()", explanationIfWrong: "alert is not a test assertion method." },
            { id: "D", text: "document.write()", explanationIfWrong: "document.write overwrites the document and is not used in tests." }
          ],
          correctAnswer: "A",
          explanationNote: "Because getByText throws when an element is missing, queryByText must be used to check for absence with .toBeNull()."
        },
        retestMcq: {
          id: "q-5.4-4-v2",
          question: "How can a test verify that details appear after the user clicks the 'view' button?",
          options: [
            { id: "A", text: "Simulate a click on the 'view' button using userEvent, then assert that the URL is found with screen.getByText()", explanationIfWrong: "Clicking the button updates state, making details visible and queryable with getByText." },
            { id: "B", text: "Manually mutate the component's internal state variable to true", explanationIfWrong: "Tests should interact like real users via buttons, not mutate private state." },
            { id: "C", text: "Call render(<Blog />) a second time with new props", explanationIfWrong: "Testing user interaction requires clicking the rendered button." },
            { id: "D", text: "Restart the Vitest test runner", explanationIfWrong: "Restarting the runner re-runs tests from the beginning." }
          ],
          correctAnswer: "A",
          explanationNote: "Simulating a button click triggers the component's state update; subsequent assertions then verify that the details are now rendered in the DOM."
        }
      },
      {
        heading: "Container Queries with container.querySelector",
        text: "The render method returns a container DOM node that allows CSS selector queries using native querySelector when text-based queries are insufficient.",
        codeSnippet: `const { container } = render(<Note note={note} />);\nconst div = container.querySelector('.note');\nexpect(div).toHaveTextContent('Component testing');`,
        mcq: {
          id: "q-5.4-5-v1",
          question: "When is container.querySelector('.my-class') appropriate in a component test?",
          options: [
            { id: "A", text: "When querying an element by its CSS class or structural DOM hierarchy when accessible text or role queries are impractical", explanationIfWrong: "While accessible text queries are preferred, querySelector is useful for structural/class checks." },
            { id: "B", text: "Always, because class names never change during refactoring", explanationIfWrong: "Class names frequently change; accessible queries are generally preferred." },
            { id: "C", text: "Only when testing backend database migrations", explanationIfWrong: "RTL tests React components, not database migrations." },
            { id: "D", text: "Only when components contain no HTML tags", explanationIfWrong: "querySelector works on any HTML structure." }
          ],
          correctAnswer: "A",
          explanationNote: "While accessible screen queries (getByRole, getByText) are preferred by RTL, container.querySelector allows targeted class-name and CSS selector inspections when necessary."
        },
        retestMcq: {
          id: "q-5.4-5-v2",
          question: "Which matcher from @testing-library/jest-dom checks whether an element contains a given text string anywhere in its content?",
          options: [
            { id: "A", text: "expect(element).toHaveTextContent('Component testing')", explanationIfWrong: "toHaveTextContent checks text presence inside an element's textContent." },
            { id: "B", text: "expect(element).includesText('Component testing')", explanationIfWrong: "includesText is not a valid jest-dom matcher." },
            { id: "C", text: "expect(element.value).toBe('Component testing')", explanationIfWrong: ".value is for inputs, not general element textContent." },
            { id: "D", text: "expect(element.html).toMatch('Component testing')", explanationIfWrong: "The standard matcher is toHaveTextContent." }
          ],
          correctAnswer: "A",
          explanationNote: "toHaveTextContent('...') checks whether the target element contains the specified text within its rendered text content."
        }
      }
    ]
  },
  {
    id: "5-5-user-events-mock-handlers",
    number: "5.5",
    title: "User Interactions & Mock Event Handlers",
    subtitle: "Simulate authentic user typing and clicks with @testing-library/user-event, verify form submissions, and assert on mock callback parameters.",
    readTime: "12 min",
    objectives: [
      "Simulate user interactions using the @testing-library/user-event library",
      "Setup userEvent sessions using userEvent.setup()",
      "Create mock callback functions with vi.fn() or jest.fn()",
      "Simulate button clicks with await user.click(button)",
      "Simulate typing in text inputs with await user.type(input, 'text')",
      "Assert on mock function call count and argument payloads"
    ],
    theoryBlocks: [
      {
        heading: "Simulating Actions with user-event",
        text: "The @testing-library/user-event package simulates real browser events (focus, mouseover, mousedown, mouseup, click) far more accurately than fireEvent.",
        codeSnippet: `import userEvent from '@testing-library/user-event';\n\ntest('clicking the button calls event handler once', async () => {\n  const user = userEvent.setup();\n  const mockHandler = vi.fn();\n  render(<Note note={note} toggleImportance={mockHandler} />);\n  const button = screen.getByText('make not important');\n  await user.click(button);\n  expect(mockHandler.mock.calls).toHaveLength(1);\n});`,
        mcq: {
          id: "q-5.5-0-v1",
          question: "Why is userEvent preferred over fireEvent in modern React testing?",
          options: [
            { id: "A", text: "userEvent simulates all intermediate real-world browser events (focus, hover, keydown, keyup) in correct sequence, whereas fireEvent only dispatches a single isolated DOM event", explanationIfWrong: "userEvent mirrors authentic user behavior across the entire browser event pipeline." },
            { id: "B", text: "Because fireEvent was removed from npm in 2020", explanationIfWrong: "fireEvent still exists, but userEvent is higher-level and more realistic." },
            { id: "C", text: "Because userEvent can execute Python code inside the browser", explanationIfWrong: "userEvent is purely a JavaScript DOM event simulator." },
            { id: "D", text: "Because fireEvent does not support buttons", explanationIfWrong: "fireEvent supports buttons, but lacks full user interaction simulation." }
          ],
          correctAnswer: "A",
          explanationNote: "userEvent dispatches the full cascade of real browser events (focus, hover, pointerdown, click) that happen when a user interacts with a page, catching edge cases fireEvent misses."
        },
        retestMcq: {
          id: "q-5.5-0-v2",
          question: "Why must actions like user.click(button) or user.type(input, 'hello') be awaited with 'await'?",
          options: [
            { id: "A", text: "All userEvent methods are asynchronous and return Promises to simulate the natural timing of browser events", explanationIfWrong: "userEvent methods are async and must be awaited to ensure events complete before assertions run." },
            { id: "B", text: "Because JavaScript does not allow synchronous functions inside test files", explanationIfWrong: "Many test functions are synchronous; userEvent is explicitly async." },
            { id: "C", text: "To give the backend server time to respond over the internet", explanationIfWrong: "Component tests do not communicate over the internet." },
            { id: "D", text: "Because await compiles JSX into WebAssembly", explanationIfWrong: "await handles asynchronous Promises." }
          ],
          correctAnswer: "A",
          explanationNote: "userEvent methods return Promises representing the asynchronous progression of browser events. Forgetting 'await' leads to race conditions and false-passing tests."
        }
      },
      {
        heading: "Mock Functions with vi.fn() / jest.fn()",
        text: "Mock functions act as spy callbacks that record how many times they were invoked, with what arguments, and what they returned.",
        codeSnippet: `const mockHandler = vi.fn(); // or jest.fn()\n\n// Simulate interaction:\nawait user.click(button);\n\n// Assertions:\nexpect(mockHandler).toHaveBeenCalledTimes(1);\nexpect(mockHandler.mock.calls).toHaveLength(1);`,
        mcq: {
          id: "q-5.5-1-v1",
          question: "What information does mockHandler.mock.calls contain after a mock function has been invoked?",
          options: [
            { id: "A", text: "An array of arrays, where each entry represents an invocation containing the arguments passed to that call", explanationIfWrong: "mock.calls tracks every invocation and its arguments: mock.calls[callIndex][argIndex]." },
            { id: "B", text: "A single boolean indicating whether the function ever executed", explanationIfWrong: "It provides detailed arrays of all recorded calls and arguments." },
            { id: "C", text: "The CPU temperature during test execution", explanationIfWrong: "mock.calls tracks function arguments." },
            { id: "D", text: "A copy of package.json", explanationIfWrong: "mock.calls is internal test spy metadata." }
          ],
          correctAnswer: "A",
          explanationNote: "mockHandler.mock.calls is an array containing an array of arguments for each call. For example, mockHandler.mock.calls[0][0] is the first argument of the first call."
        },
        retestMcq: {
          id: "q-5.5-1-v2",
          question: "Which matcher cleanly asserts that a mock function was called exactly twice?",
          options: [
            { id: "A", text: "expect(mockHandler).toHaveBeenCalledTimes(2)", explanationIfWrong: "toHaveBeenCalledTimes(2) asserts exact call frequency." },
            { id: "B", text: "expect(mockHandler).toBeCalledTwice()", explanationIfWrong: "toBeCalledTwice is not a standard Jest/Vitest matcher." },
            { id: "C", text: "expect(mockHandler.count).toBe(2)", explanationIfWrong: "Mocks store calls in mock.calls, or use toHaveBeenCalledTimes." },
            { id: "D", text: "expect(mockHandler.runs).toEqual(2)", explanationIfWrong: "The standard matcher is toHaveBeenCalledTimes(2)." }
          ],
          correctAnswer: "A",
          explanationNote: "toHaveBeenCalledTimes(2) is the standard, readable matcher for verifying the exact number of times a mock function was executed."
        }
      },
      {
        heading: "Simulating Form Input with user.type()",
        text: "The user.type() method simulates typing characters into an input field one-by-one, triggering change and input events naturally.",
        codeSnippet: `const input = screen.getByRole('textbox');\nawait user.type(input, 'testing a form...');\nexpect(input.value).toBe('testing a form...');`,
        mcq: {
          id: "q-5.5-2-v1",
          question: "What is the recommended accessible way to query a standard text input using React Testing Library?",
          options: [
            { id: "A", text: "screen.getByRole('textbox') or screen.getByPlaceholderText('...')", explanationIfWrong: "getByRole('textbox') queries by accessible role, while placeholder queries by user hint." },
            { id: "B", text: "document.getElementsByTagName('input')[0]", explanationIfWrong: "Direct DOM queries are brittle and ignore accessibility." },
            { id: "C", text: "screen.getByClass('input-box')", explanationIfWrong: "RTL does not have a getByClass method." },
            { id: "D", text: "screen.findMemoryAddress(0x001)", explanationIfWrong: "Memory addresses are not part of DOM testing." }
          ],
          correctAnswer: "A",
          explanationNote: "RTL encourages querying by accessible role (screen.getByRole('textbox')) or label/placeholder text, mirroring how assistive technologies locate inputs."
        },
        retestMcq: {
          id: "q-5.5-2-v2",
          question: "If a component has multiple inputs, how can you query a specific input using getByRole?",
          options: [
            { id: "A", text: "screen.getByRole('textbox', { name: /username/i }) (using its associated <label> text)", explanationIfWrong: "The name option filters by accessible name (e.g. from associated labels)." },
            { id: "B", text: "screen.getByRole('textbox').first()", explanationIfWrong: "getByRole throws if multiple elements match; filter by accessible name instead." },
            { id: "C", text: "screen.getByRole('textbox2')", explanationIfWrong: "'textbox2' is not a valid ARIA role." },
            { id: "D", text: "screen.queryByNumber(1)", explanationIfWrong: "queryByNumber is not an RTL method." }
          ],
          correctAnswer: "A",
          explanationNote: "Using screen.getByRole('textbox', { name: /username/i }) queries the input whose associated <label> contains 'username', which is the most accessible testing pattern."
        }
      },
      {
        heading: "Testing Form Submission Payload",
        text: "Component tests for forms should fill in inputs, click submit, and verify that the submit callback was called with the correct object data.",
        codeSnippet: `test('<NoteForm /> updates parent state and calls onSubmit', async () => {\n  const createNote = vi.fn();\n  const user = userEvent.setup();\n  render(<NoteForm createNote={createNote} />);\n  const input = screen.getByRole('textbox');\n  const sendButton = screen.getByText('save');\n\n  await user.type(input, 'testing a form...');\n  await user.click(sendButton);\n\n  expect(createNote.mock.calls).toHaveLength(1);\n  expect(createNote.mock.calls[0][0].content).toBe('testing a form...');\n});`,
        mcq: {
          id: "q-5.5-3-v1",
          question: "In the test above, what does expect(createNote.mock.calls[0][0].content).toBe('testing a form...') verify?",
          options: [
            { id: "A", text: "That the createNote callback was called with an object whose content property matches the text typed into the input", explanationIfWrong: "It asserts that the child form passes the user's typed input data to the callback." },
            { id: "B", text: "That the browser saved the note to localStorage", explanationIfWrong: "It verifies the callback arguments, not localStorage." },
            { id: "C", text: "That the input was deleted from the DOM", explanationIfWrong: "It checks the argument passed to the parent handler." },
            { id: "D", text: "That the test runner printed the text in green", explanationIfWrong: "It tests application business logic." }
          ],
          correctAnswer: "A",
          explanationNote: "createNote.mock.calls[0][0] accesses the first argument of the first call, verifying that the form constructed the proper payload object from user input."
        },
        retestMcq: {
          id: "q-5.5-3-v2",
          question: "Why should we test NoteForm in isolation with a mock createNote function instead of testing the entire App component?",
          options: [
            { id: "A", text: "Unit-testing NoteForm in isolation runs instantly and verifies form state and event wiring without needing backend network mocks", explanationIfWrong: "Isolated unit tests are fast, focused, and pinpoint form bugs immediately." },
            { id: "B", text: "Because the App component is not allowed to be rendered in tests", explanationIfWrong: "App can be tested in integration tests; isolated unit tests provide faster feedback." },
            { id: "C", text: "Because NoteForm cannot be rendered inside App", explanationIfWrong: "NoteForm is rendered inside App in real usage." },
            { id: "D", text: "To prevent Vitest from testing too many files", explanationIfWrong: "The reason is test isolation and maintainability." }
          ],
          correctAnswer: "A",
          explanationNote: "Isolated component tests verify that the form collects input and invokes its callback with the expected payload, free of network dependencies."
        }
      },
      {
        heading: "Testing Repeated Clicks (Likes Counter)",
        text: "Verifying that clicking a 'like' button twice invokes the event handler twice ensures that event listeners are not accidentally throttled or unbound.",
        codeSnippet: `test('clicking like button twice calls event handler twice', async () => {\n  const mockHandler = vi.fn();\n  const user = userEvent.setup();\n  render(<Blog blog={blog} handleLike={mockHandler} />);\n  const likeButton = screen.getByText('like');\n  await user.click(likeButton);\n  await user.click(likeButton);\n  expect(mockHandler).toHaveBeenCalledTimes(2);\n});`,
        mcq: {
          id: "q-5.5-4-v1",
          question: "What common bug does testing two consecutive clicks with expect(mockHandler).toHaveBeenCalledTimes(2) catch?",
          options: [
            { id: "A", text: "Bugs where the button is disabled after a single click, or where event listeners fail to re-bind after a re-render", explanationIfWrong: "Repeated click tests catch stale closures and inadvertent disabling of controls." },
            { id: "B", text: "Bugs where the browser window minimizes automatically", explanationIfWrong: "Event tests do not control browser window sizing." },
            { id: "C", text: "Database connection timeout errors", explanationIfWrong: "Component unit tests do not connect to live databases." },
            { id: "D", text: "Syntax errors in package.json", explanationIfWrong: "package.json syntax is checked by npm/linters." }
          ],
          correctAnswer: "A",
          explanationNote: "Testing repeated clicks verifies that event handlers remain active and functional across multiple re-renders and state transitions."
        },
        retestMcq: {
          id: "q-5.5-4-v2",
          question: "If user.click(likeButton) is called twice, but mockHandler was only called once, what is the most likely cause?",
          options: [
            { id: "A", text: "The component disabled the button after the first click or the second click was not awaited", explanationIfWrong: "A disabled button or un-awaited click promise will result in only one recorded call." },
            { id: "B", text: "The computer's mouse has run out of battery", explanationIfWrong: "Simulated test events run in software without hardware mice." },
            { id: "C", text: "MongoDB Atlas has rejected the test", explanationIfWrong: "Databases are not involved in component unit tests." },
            { id: "D", text: "Vitest automatically divides all numbers by 2", explanationIfWrong: "Vitest does not alter test numbers." }
          ],
          correctAnswer: "A",
          explanationNote: "If the second call is missing, either the button became disabled, the event handler was not re-attached after re-render, or the second click was not awaited."
        }
      },
      {
        heading: "Snapshot Testing vs Behavioral Testing",
        text: "Behavioral testing with RTL and user-event focuses on user interaction, which is far more durable than brittle HTML snapshot comparisons.",
        codeSnippet: `// ❌ Snapshot testing (often brittle):\n// expect(container).toMatchSnapshot();\n\n// ✅ Behavioral testing (resilient):\nexpect(screen.getByText('Hello World')).toBeDefined();`,
        mcq: {
          id: "q-5.5-5-v1",
          question: "Why do many frontend teams prefer behavioral tests over snapshot tests?",
          options: [
            { id: "A", text: "Snapshots break on trivial markup changes (like changing a class name or tag) even when functionality is intact, leading developers to blindly update them without review", explanationIfWrong: "Snapshot fatigue causes developers to accept bad snapshots without careful inspection." },
            { id: "B", text: "Snapshots take 30 minutes each to generate", explanationIfWrong: "Snapshots generate quickly; the problem is their fragility." },
            { id: "C", text: "Snapshot testing was deprecated in React 18", explanationIfWrong: "Snapshots still exist, but behavioral testing is the recommended best practice." },
            { id: "D", text: "Snapshots only work on Android devices", explanationIfWrong: "Snapshots are platform-agnostic string comparison files." }
          ],
          correctAnswer: "A",
          explanationNote: "Snapshot tests break on harmless layout changes, leading to 'snapshot fatigue' where broken snapshots are accepted blindly. Behavioral testing verifies real user functionality."
        },
        retestMcq: {
          id: "q-5.5-5-v2",
          question: "Which of the following tests is an example of resilient behavioral testing?",
          options: [
            { id: "A", text: "Typing into a form input, clicking submit, and asserting that the success message appears on screen", explanationIfWrong: "This tests genuine user-visible behavior that stays valid regardless of internal refactoring." },
            { id: "B", text: "Asserting that the component contains exactly 3 <div> tags and 2 <p> tags", explanationIfWrong: "Tag counts are brittle structural details that break on styling refactors." },
            { id: "C", text: "Verifying the exact memory address of the component in RAM", explanationIfWrong: "Memory addresses are low-level runtime details." },
            { id: "D", text: "Checking that the JavaScript file is under 40 lines of code", explanationIfWrong: "Line counts are code style metrics, not functionality tests." }
          ],
          correctAnswer: "A",
          explanationNote: "Testing that user actions produce expected user-visible outcomes verifies that the application works for the end user, remaining robust during code refactoring."
        }
      }
    ]
  },
  {
    id: "5-6-e2e-testing-playwright-cypress",
    number: "5.6",
    title: "End-to-End (E2E) Testing Architecture",
    subtitle: "Test complete systems from browser to database using Playwright or Cypress, manage test environments, and verify user flows end-to-end.",
    readTime: "13 min",
    objectives: [
      "Understand the testing pyramid: unit tests vs integration tests vs E2E tests",
      "Configure Playwright or Cypress for automated headless browser testing",
      "Reset the backend test database using a dedicated testing controller (POST /api/testing/reset)",
      "Automate user login, resource creation, and verification in real browsers",
      "Assert on DOM element visibility, notifications, and ordering in E2E suites",
      "Identify the trade-offs between test execution speed and full-system confidence"
    ],
    theoryBlocks: [
      {
        heading: "The Testing Pyramid Concept",
        text: "The testing pyramid balances fast, granular unit tests at the base, integration tests in the middle, and a focused suite of end-to-end (E2E) tests at the top.",
        codeSnippet: `//         /\\        E2E Tests (Playwright/Cypress)\n//        /  \\       Slowest, highest confidence\n//       /----\\      Integration Tests (Supertest/RTL)\n//      /      \\     Medium speed & scope\n//     /--------\\    Unit Tests (Pure functions)\n//    /__________\\   Fastest, highly isolated`,
        mcq: {
          id: "q-5.6-0-v1",
          question: "According to the testing pyramid, why shouldn't an application rely exclusively on E2E tests?",
          options: [
            { id: "A", text: "E2E tests are slow to execute, resource-intensive, and prone to flakiness compared to unit and integration tests", explanationIfWrong: "E2E tests take seconds per test and require full browser automation, making thousands of them impractical." },
            { id: "B", text: "Because E2E tests cannot test frontend user interfaces", explanationIfWrong: "E2E tests specifically test frontend user interfaces in real browsers." },
            { id: "C", text: "Because E2E tests are forbidden in continuous integration pipelines", explanationIfWrong: "E2E tests are standard in CI, but their count is kept balanced." },
            { id: "D", text: "Because E2E tests only work on Google Chrome", explanationIfWrong: "Modern E2E runners test Chrome, Firefox, and WebKit/Safari." }
          ],
          correctAnswer: "A",
          explanationNote: "E2E tests take significant time and computing power to run. Relying on unit and integration tests for edge cases keeps feedback fast while E2E tests verify critical user flows."
        },
        retestMcq: {
          id: "q-5.6-0-v2",
          question: "What is the unique advantage of End-to-End (E2E) tests over unit and integration tests?",
          options: [
            { id: "A", text: "They test the entire real system from browser UI to backend server and database working together in a real browser engine", explanationIfWrong: "E2E tests provide the highest confidence that all layers integrate seamlessly in production." },
            { id: "B", text: "They execute 100 times faster than unit tests", explanationIfWrong: "Unit tests are orders of magnitude faster than E2E tests." },
            { id: "C", text: "They do not require any test code to be written", explanationIfWrong: "E2E tests require comprehensive test scripts." },
            { id: "D", text: "They prevent developers from having to learn JavaScript", explanationIfWrong: "E2E tests in Playwright and Cypress are written in JavaScript/TypeScript." }
          ],
          correctAnswer: "A",
          explanationNote: "E2E tests launch real browser engines and execute live network requests against the backend, verifying that all layers work together seamlessly."
        }
      },
      {
        heading: "Dedicated Testing Backend Controller",
        text: "To allow E2E tests to quickly reset the database, the backend exposes a dedicated testing route that is only registered when NODE_ENV === 'test'.",
        codeSnippet: `// app.js:\nif (process.env.NODE_ENV === 'test') {\n  const testingRouter = require('./controllers/testing');\n  app.use('/api/testing', testingRouter);\n}\n\n// controllers/testing.js:\ntestingRouter.post('/reset', async (req, res) => {\n  await Note.deleteMany({});\n  await User.deleteMany({});\n  res.status(204).end();\n});`,
        mcq: {
          id: "q-5.6-1-v1",
          question: "Why MUST the /api/testing router be guarded with if (process.env.NODE_ENV === 'test')?",
          options: [
            { id: "A", text: "To guarantee that the /reset endpoint is NEVER accessible in production, preventing malicious users from wiping the production database", explanationIfWrong: "Exposing a database reset endpoint in production is an extreme vulnerability." },
            { id: "B", text: "Because Node.js crashes if testing routers run in development", explanationIfWrong: "It would run, but exposing it outside of testing is dangerous." },
            { id: "C", text: "To compress the router file size", explanationIfWrong: "The guard is purely a vital security boundary." },
            { id: "D", text: "Because MongoDB Atlas does not allow routes named 'testing'", explanationIfWrong: "Route names are arbitrary Express paths." }
          ],
          correctAnswer: "A",
          explanationNote: "Guarding /api/testing with NODE_ENV === 'test' ensures that dangerous test helper endpoints (like resetting all database collections) can never be accessed in production."
        },
        retestMcq: {
          id: "q-5.6-1-v2",
          question: "How does the E2E test runner reset the database before each test suite?",
          options: [
            { id: "A", text: "By sending an HTTP POST request to /api/testing/reset in a beforeEach hook", explanationIfWrong: "Calling the reset endpoint clears the database quickly before each test scenario." },
            { id: "B", text: "By physically unplugging the server power cable", explanationIfWrong: "Database resets are performed through HTTP APIs." },
            { id: "C", text: "By restarting the user's computer", explanationIfWrong: "Automated tests execute reset commands programmatically." },
            { id: "D", text: "By reinstalling Node.js from scratch", explanationIfWrong: "Reinstalling Node is unnecessary and slow." }
          ],
          correctAnswer: "A",
          explanationNote: "Calling POST /api/testing/reset in beforeEach ensures the test database is completely purged and re-seeded before every E2E scenario."
        }
      },
      {
        heading: "Automating User Login in E2E",
        text: "E2E tests locate form fields using page.getByRole() or page.getByLabel(), fill in credentials, and click login to verify the authenticated view.",
        codeSnippet: `// Playwright test:\ntest('user can log in successfully', async ({ page }) => {\n  await page.goto('http://localhost:5173');\n  await page.getByRole('button', { name: 'login' }).click();\n  await page.getByTestId('username').fill('mluukkai');\n  await page.getByTestId('password').fill('salainen');\n  await page.getByRole('button', { name: 'submit' }).click();\n  await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible();\n});`,
        mcq: {
          id: "q-5.6-2-v1",
          question: "What does expect(page.getByText('Matti Luukkainen logged in')).toBeVisible() assert in Playwright?",
          options: [
            { id: "A", text: "That the element containing that text is present in the DOM, has non-zero size, and is not hidden by CSS display: none or opacity: 0", explanationIfWrong: "toBeVisible verifies genuine visual visibility to the user." },
            { id: "B", text: "That the text was sent to the printer", explanationIfWrong: "toBeVisible checks browser screen presentation." },
            { id: "C", text: "That the user's webcam is turned on", explanationIfWrong: "It has nothing to do with webcams." },
            { id: "D", text: "That the text exists in the database", explanationIfWrong: "It asserts visual rendering in the browser DOM." }
          ],
          correctAnswer: "A",
          explanationNote: "toBeVisible() in Playwright checks that the element is attached to the DOM and genuinely visible to the user (not hidden with display: none, opacity: 0, or zero dimensions)."
        },
        retestMcq: {
          id: "q-5.6-2-v2",
          question: "Why are data-testid attributes (e.g. data-testid='username') commonly used in E2E test suites?",
          options: [
            { id: "A", text: "They provide resilient, dedicated selectors for test automation that don't break when CSS styles, classes, or layout tags change", explanationIfWrong: "data-testid attributes decouple test selectors from volatile visual styling." },
            { id: "B", text: "Because browsers require data-testid to execute JavaScript", explanationIfWrong: "Browsers execute JavaScript regardless of data-testid attributes." },
            { id: "C", text: "To encrypt the input value before submission", explanationIfWrong: "data-testid is purely an HTML data attribute for querying." },
            { id: "D", text: "To allow MongoDB Atlas to index the input field", explanationIfWrong: "Data attributes are client-side HTML attributes." }
          ],
          correctAnswer: "A",
          explanationNote: "data-testid attributes provide dedicated anchors for automated tests, ensuring tests remain stable when designers update CSS classes or markup tags."
        }
      },
      {
        heading: "Fast-Bypassing UI Login in Tests",
        text: "To speed up E2E tests that test features other than login, tests can bypass typing credentials by issuing a direct backend request and setting localStorage.",
        codeSnippet: `// Helper to log in instantly:\nconst loginWith = async (page, username, password) => {\n  const response = await request.post('http://localhost:3001/api/login', {\n    data: { username, password }\n  });\n  const user = await response.json();\n  await page.evaluate(u => {\n    window.localStorage.setItem('loggedNoteappUser', JSON.stringify(u));\n  }, user);\n  await page.goto('http://localhost:5173');\n};`,
        mcq: {
          id: "q-5.6-3-v1",
          question: "Why is programmatically seeding localStorage faster than manually typing credentials in every single E2E test?",
          options: [
            { id: "A", text: "It bypasses typing delay and form submission overhead, instantly establishing an authenticated session in milliseconds", explanationIfWrong: "Directly setting authentication state saves seconds on every test scenario." },
            { id: "B", text: "Because typing credentials causes the browser to crash", explanationIfWrong: "Typing works fine, but is slow when repeated across dozens of tests." },
            { id: "C", text: "Because backend servers reject more than one login per day", explanationIfWrong: "Servers accept any number of valid logins." },
            { id: "D", text: "Because localStorage is faster than RAM", explanationIfWrong: "localStorage writes to disk/browser storage." }
          ],
          correctAnswer: "A",
          explanationNote: "Bypassing the login UI for tests that verify post-login features (like creating or liking blogs) saves seconds on every test, dramatically speeding up test suites."
        },
        retestMcq: {
          id: "q-5.6-3-v2",
          question: "In Playwright, what does page.evaluate() do?",
          options: [
            { id: "A", text: "It executes a JavaScript function directly in the browser's execution context (giving access to window, localStorage, etc.)", explanationIfWrong: "page.evaluate runs code inside the browser page context." },
            { id: "B", text: "It evaluates student test scores", explanationIfWrong: "It is an automation method that runs code in the target browser." },
            { id: "C", text: "It restarts the Node.js process", explanationIfWrong: "It runs JavaScript inside the browser context." },
            { id: "D", text: "It converts HTML into PDF", explanationIfWrong: "page.pdf does PDF export; evaluate runs in-browser JavaScript." }
          ],
          correctAnswer: "A",
          explanationNote: "page.evaluate() runs the supplied function within the browser's JavaScript environment, granting direct access to window, document, and localStorage."
        }
      },
      {
        heading: "Testing Element Order and Ranking",
        text: "E2E tests can verify that items (like blogs) re-order dynamically when their likes increase, ensuring descending rank sorting works end-to-end.",
        codeSnippet: `// Verify blogs are sorted by likes descending:\ntest('blogs are ordered according to likes with most likes first', async ({ page }) => {\n  const blogElements = await page.getByRole('listitem').all();\n  const texts = await Promise.all(blogElements.map(b => b.textContent()));\n  expect(texts[0]).toContain('Blog with 15 likes');\n  expect(texts[1]).toContain('Blog with 10 likes');\n});`,
        mcq: {
          id: "q-5.6-4-v1",
          question: "How can an E2E test confirm that a newly liked item automatically moves to the top of a sorted list?",
          options: [
            { id: "A", text: "Click the like button, wait for the like count to update, query all list items, and verify that the target item is the first element (index 0)", explanationIfWrong: "Asserting on the first list item confirms dynamic re-sorting succeeded." },
            { id: "B", text: "Inspect the MongoDB database directly with a shell script", explanationIfWrong: "E2E tests verify the live browser UI, not raw database shells." },
            { id: "C", text: "Check that the browser window displays a gold medal icon", explanationIfWrong: "Visual badges depend on UI logic; checking element order is standard." },
            { id: "D", text: "Verify that the page refreshes 5 times", explanationIfWrong: "Single page apps should not reload when items re-order." }
          ],
          correctAnswer: "A",
          explanationNote: "Simulating a like increment and asserting that the modified item occupies the first position (index 0) in the list verifies dynamic real-time sorting."
        },
        retestMcq: {
          id: "q-5.6-4-v2",
          question: "Why should E2E tests wait for asynchronous DOM updates before making assertions on element positions?",
          options: [
            { id: "A", text: "Network requests and React re-renders are asynchronous; asserting immediately before the state update completes causes intermittent test failures", explanationIfWrong: "Waiting for network responses and re-renders prevents flaky test timing bugs." },
            { id: "B", text: "Because JavaScript stops running while the test runner executes", explanationIfWrong: "JavaScript runs continuously; timing coordination is the reason." },
            { id: "C", text: "Because Playwright only allows assertions after 10 seconds", explanationIfWrong: "Playwright auto-waits, but assertions should target updated values." },
            { id: "D", text: "To give the CPU time to cool down", explanationIfWrong: "Asynchronous coordination ensures UI state is up to date." }
          ],
          correctAnswer: "A",
          explanationNote: "Because API responses and React state updates are asynchronous, awaiting DOM updates prevents race conditions that cause intermittent test failures."
        }
      },
      {
        heading: "Full Stack Open Part 5 Certification",
        text: "Part 5 completes your full stack frontend mastery: token management, reusable container components, React refs, component unit testing, and full E2E automation.",
        codeSnippet: `// Complete Frontend Testing Stack:\n// 1. Vitest / Jest: Fast test runner\n// 2. React Testing Library: User-centered component testing\n// 3. user-event: Authentic browser interaction simulation\n// 4. Playwright / Cypress: Complete browser-to-database E2E testing`,
        mcq: {
          id: "q-5.6-5-v1",
          question: "Which of the following summaries best captures the complete frontend engineering and testing competencies mastered in Part 5?",
          options: [
            { id: "A", text: "JWT token persistence in localStorage, reusable container components with forwardRef, isolated component testing with React Testing Library, and full E2E automation with Playwright/Cypress", explanationIfWrong: "This comprehensive summary encompasses the full scope of Part 5." },
            { id: "B", text: "Writing raw HTML files without React or automated testing", explanationIfWrong: "Part 5 focuses on React, automated testing, and authentication." },
            { id: "C", text: "Managing relational databases using manual SQL scripts without frontend code", explanationIfWrong: "Part 5 is focused primarily on React and frontend testing." },
            { id: "D", text: "Replacing all web applications with native Android Java code", explanationIfWrong: "Full Stack Open is a modern web development curriculum." }
          ],
          correctAnswer: "A",
          explanationNote: "Part 5 delivers mastery across modern frontend state management, authentication token handling, component testing with RTL, and end-to-end browser automation."
        },
        retestMcq: {
          id: "q-5.6-5-v2",
          question: "What is the ultimate goal of combining unit tests, component tests, and E2E tests in a professional production codebase?",
          options: [
            { id: "A", text: "To maximize development velocity and product reliability by catching bugs early with fast unit tests while ensuring critical user journeys work flawlessly with E2E tests", explanationIfWrong: "A balanced test suite gives developers speed, high confidence, and robust regression protection." },
            { id: "B", text: "To write more test lines than application code to impress investors", explanationIfWrong: "Testing is for software reliability and engineering velocity, not vanity metrics." },
            { id: "C", text: "To eliminate the need for deploying software to production", explanationIfWrong: "Testing ensures reliable deployments, not avoiding them." },
            { id: "D", text: "To slow down deployment pipelines so developers work fewer hours", explanationIfWrong: "Testing increases velocity by eliminating fear of breaking production." }
          ],
          correctAnswer: "A",
          explanationNote: "A balanced testing strategy catches errors at the lowest possible cost, preventing regressions and giving engineering teams the confidence to deploy rapidly."
        }
      }
    ]
  }
];

// Helper functions for Level attempts, question selection, and 3-consecutive-failure progression lock
export const getLevelAttemptCountFullstackPart5 = (sectionId: string, studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_fullstack_p5_attempt_${sectionId}_${studentId}`);
    return saved ? Number(saved) : 1;
  } catch {
    return 1;
  }
};

export const setLevelAttemptCountFullstackPart5 = (sectionId: string, studentId: string, count: number): void => {
  try {
    localStorage.setItem(`dopilot_fullstack_p5_attempt_${sectionId}_${studentId}`, String(count));
  } catch {}
};

export const getActiveQuestionsForLevelFullstackPart5 = (
  section: SectionContent,
  studentId: string,
  forceRetest: boolean = false
): McqQuestion[] => {
  const attempt = forceRetest ? 2 : getLevelAttemptCountFullstackPart5(section.id, studentId);
  return section.theoryBlocks.map((block) => {
    if (attempt >= 2 && block.retestMcq) {
      return block.retestMcq;
    }
    return block.mcq!;
  });
};

export const getConsecutiveFailedLevelsFullstackPart5 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_fullstack_p5_failed_levels_streak_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const recordLevelAttemptResultFullstackPart5 = (
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
  const currentAttempt = getLevelAttemptCountFullstackPart5(sectionId, studentId);

  if (isPassed) {
    try {
      localStorage.setItem(`dopilot_fullstack_p5_failed_levels_streak_${studentId}`, '0');
      localStorage.setItem(`dopilot_fullstack_p5_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_fullstack_p5_attempt_${sectionId}_${studentId}`, '1');
      localStorage.removeItem(`dopilot_fullstack_p5_locked_${studentId}`);
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
      setLevelAttemptCountFullstackPart5(sectionId, studentId, 2);
      const streak = getConsecutiveFailedLevelsFullstackPart5(studentId);

      return {
        isPassed: false,
        attemptCount: 1,
        isSecondFailureInLevel: false,
        consecutiveFailedLevels: streak,
        isLocked: false
      };
    } else {
      const prevStreak = getConsecutiveFailedLevelsFullstackPart5(studentId);
      const newStreak = prevStreak + 1;
      const isLocked = newStreak >= 3;

      try {
        localStorage.setItem(`dopilot_fullstack_p5_failed_levels_streak_${studentId}`, String(newStreak));
        localStorage.setItem(`dopilot_fullstack_p5_consecutive_failures_${studentId}`, String(newStreak));
        if (isLocked) {
          localStorage.setItem(`dopilot_fullstack_p5_locked_${studentId}`, 'true');
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

export const resetConsecutiveFailuresFullstackPart5 = (studentId: string): void => {
  try {
    localStorage.setItem(`dopilot_fullstack_p5_consecutive_failures_${studentId}`, '0');
    localStorage.setItem(`dopilot_fullstack_p5_failed_levels_streak_${studentId}`, '0');
    localStorage.removeItem(`dopilot_fullstack_p5_locked_${studentId}`);
  } catch {}
};
