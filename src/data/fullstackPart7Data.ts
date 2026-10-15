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

export const FULLSTACK_PART_7_SECTIONS: SectionContent[] = [
  {
    id: "7-1-react-router-basics",
    number: "7.1",
    title: "React Router Core: Navigation & Routing",
    subtitle: "Build single-page web applications with multiple view states using BrowserRouter, Routes, Route, and Link components.",
    readTime: "12 min",
    objectives: [
      "Understand client-side routing in single-page applications without page reloads",
      "Configure React Router using BrowserRouter, Routes, and Route",
      "Create declarative navigation links with the <Link to='...'> component",
      "Render shared layout navigation headers across all subpages",
      "Display catch-all 404 Not Found views for undefined routes",
      "Differentiate between browser address bar changes and server GET requests"
    ],
    theoryBlocks: [
      {
        heading: "Client-Side Routing Concept",
        text: "In a single-page app (SPA), client-side routing changes the URL and swaps components conditionally without requesting a new HTML document from the server.",
        codeSnippet: `// Single-page routing: Browser URL changes, React swaps views in memory\n// No full-page HTML reloading from the web server!`,
        mcq: {
          id: "q-7.1-0-v1",
          question: "How does client-side routing in React differ from traditional multi-page web routing?",
          options: [
            { id: "A", text: "React Router intercepts URL changes and renders different components in memory without requesting a new HTML page from the server", explanationIfWrong: "Client-side routing eliminates full page reload round-trips to the server." },
            { id: "B", text: "Traditional routing uses JavaScript, while client-side routing only uses CSS", explanationIfWrong: "Client-side routing is powered entirely by JavaScript." },
            { id: "C", text: "Client-side routing requires restarting the Node.js backend on every click", explanationIfWrong: "The backend server is not contacted for routing page transitions." },
            { id: "D", text: "Traditional routing cannot display images", explanationIfWrong: "Both types of routing can display images." }
          ],
          correctAnswer: "A",
          explanationNote: "Client-side routing updates the browser's URL and renders matching React components dynamically, avoiding the latency and flicker of full-page HTML reloads."
        },
        retestMcq: {
          id: "q-7.1-0-v2",
          question: "What browser API does React Router use internally to manipulate the URL without triggering a page reload?",
          options: [
            { id: "A", text: "HTML5 History API (window.history.pushState and popstate event)", explanationIfWrong: "The HTML5 History API enables changing URLs programmatically without reloading." },
            { id: "B", text: "Web Audio API", explanationIfWrong: "Web Audio API generates sound, not URL navigation." },
            { id: "C", text: "WebGL 3D Canvas API", explanationIfWrong: "WebGL renders 3D graphics." },
            { id: "D", text: "Battery Status API", explanationIfWrong: "Battery Status API monitors hardware battery levels." }
          ],
          correctAnswer: "A",
          explanationNote: "React Router utilizes HTML5 window.history.pushState() and listen events to change the URL bar smoothly while keeping the single-page application alive."
        }
      },
      {
        heading: "BrowserRouter & Routes Setup",
        text: "BrowserRouter wraps the app to sync with the URL, while Routes evaluates child Route elements and renders the one that matches the current pathname.",
        codeSnippet: `import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';\n\nconst App = () => (\n  <Router>\n    <Routes>\n      <Route path="/" element={<Home />} />\n      <Route path="/notes" element={<Notes />} />\n      <Route path="/users" element={<Users />} />\n    </Routes>\n  </Router>\n);`,
        mcq: {
          id: "q-7.1-1-v1",
          question: "What is the role of the <Routes> wrapper component in React Router v6?",
          options: [
            { id: "A", text: "It looks through all its child <Route> elements and renders the single best-matching element based on the current URL pathname", explanationIfWrong: "Routes chooses and renders the best-matching Route element." },
            { id: "B", text: "It compiles all React code to machine assembly", explanationIfWrong: "Routes is a standard React routing component." },
            { id: "C", text: "It renders all routes simultaneously on top of each other", explanationIfWrong: "Routes selects only the matching route to render." },
            { id: "D", text: "It deletes localStorage data", explanationIfWrong: "Routes has no effect on browser storage." }
          ],
          correctAnswer: "A",
          explanationNote: "<Routes> examines the current browser location, compares it against the path prop of each child <Route>, and renders the matching component element."
        },
        retestMcq: {
          id: "q-7.1-1-v2",
          question: "What prop on the <Route> component specifies the JSX component to display when the path matches?",
          options: [
            { id: "A", text: "element={<MyComponent />}", explanationIfWrong: "In React Router v6, element accepts a JSX element (e.g. element={<MyComponent />})." },
            { id: "B", text: "render={MyComponent}", explanationIfWrong: "render was used in v5; v6 uses element={<Component />}." },
            { id: "C", text: "component='MyComponent'", explanationIfWrong: "component string is not a valid prop in React Router." },
            { id: "D", text: "html='<div>...</div>'", explanationIfWrong: "JSX elements are passed via the element prop." }
          ],
          correctAnswer: "A",
          explanationNote: "React Router v6 uses the element prop (e.g. <Route path='/notes' element={<Notes />} />) to specify the element to render."
        }
      },
      {
        heading: "Declarative Navigation with <Link>",
        text: "The <Link to='...'> component renders an accessible anchor tag but intercepts clicks to perform client-side navigation without a browser reload.",
        codeSnippet: `import { Link } from 'react-router-dom';\n\nconst Navigation = () => (\n  <nav>\n    <Link to="/">home</Link> |\n    <Link to="/notes">notes</Link> |\n    <Link to="/users">users</Link>\n  </nav>\n);`,
        mcq: {
          id: "q-7.1-2-v1",
          question: "Why should you use React Router's <Link to='/notes'> instead of a standard HTML <a href='/notes'> tag?",
          options: [
            { id: "A", text: "<Link> prevents a full browser reload, maintaining all in-memory React state and Redux stores during navigation", explanationIfWrong: "Standard <a href> triggers a complete page reload, wiping client memory." },
            { id: "B", text: "Because HTML <a> tags are forbidden in HTML5", explanationIfWrong: "Anchor tags are valid HTML, but reload the whole document." },
            { id: "C", text: "Because <Link> encrypts the URL with AES-GCM", explanationIfWrong: "<Link> is for SPA navigation, not encryption." },
            { id: "D", text: "Because <a> tags cannot contain text", explanationIfWrong: "<a> tags contain text, but reload the page." }
          ],
          correctAnswer: "A",
          explanationNote: "Using standard <a href> causes the browser to fetch the page anew from the server, wiping in-memory React and Redux state. <Link> performs client-side navigation in memory."
        },
        retestMcq: {
          id: "q-7.1-2-v2",
          question: "What underlying HTML element does <Link to='/about'> render into the final DOM?",
          options: [
            { id: "A", text: "A standard <a href='/about'> element with an intercepted click event listener", explanationIfWrong: "Link renders a semantic <a> tag for accessibility and SEO, but prevents default reload on click." },
            { id: "B", text: "A <button> element", explanationIfWrong: "Link renders an anchor tag, preserving link accessibility." },
            { id: "C", text: "A <div> element with cursor: pointer", explanationIfWrong: "Link renders semantic anchor tags." },
            { id: "D", text: "An <iframe /> element", explanationIfWrong: "Link does not use iframes." }
          ],
          correctAnswer: "A",
          explanationNote: "<Link> outputs an accessible <a href='...'> tag so search engines and assistive technologies recognize it as a hyperlink, while intercepting mouse clicks to prevent full reloads."
        }
      },
      {
        heading: "Persistent Layouts with Shared Headers",
        text: "Placing navigation menus outside of the <Routes> block keeps the header visible across all pages while subviews switch dynamically beneath it.",
        codeSnippet: `const App = () => (\n  <Router>\n    <header>\n      <Link to="/">Home</Link> <Link to="/notes">Notes</Link>\n    </header>\n    <Routes>\n      <Route path="/" element={<Home />} />\n      <Route path="/notes" element={<Notes />} />\n    </Routes>\n    <footer>Full Stack Open 2026</footer>\n  </Router>\n);`,
        mcq: {
          id: "q-7.1-3-v1",
          question: "Why does the <header> and <footer> remain visible when the user navigates between / and /notes in the snippet above?",
          options: [
            { id: "A", text: "They are placed outside of the <Routes> container, so they remain permanently mounted while only the matching child of <Routes> swaps", explanationIfWrong: "Elements outside of <Routes> are part of the static layout wrapper." },
            { id: "B", text: "Because React copies them into browser localStorage", explanationIfWrong: "Layout rendering is handled by the component tree structure, not localStorage." },
            { id: "C", text: "Because Express serves them as static images", explanationIfWrong: "They are live React components." },
            { id: "D", text: "Because HTML requires headers to be immutable", explanationIfWrong: "Headers remain mounted because their component position is outside <Routes>." }
          ],
          correctAnswer: "A",
          explanationNote: "Components located inside <Router> but outside <Routes> (like headers and footers) never unmount during page transitions, acting as persistent layouts."
        },
        retestMcq: {
          id: "q-7.1-3-v2",
          question: "What React Router feature allows nested child routes to be rendered inside a parent layout component?",
          options: [
            { id: "A", text: "The <Outlet /> component", explanationIfWrong: "Outlet renders matching child route elements inside parent route layouts." },
            { id: "B", text: "The <Portal /> component", explanationIfWrong: "Portal is for rendering outside DOM hierarchies; Outlet is for nested routes." },
            { id: "C", text: "The <Slot /> component", explanationIfWrong: "Vue uses slots; React Router v6 uses Outlet." },
            { id: "D", text: "The <Yield /> component", explanationIfWrong: "The standard React Router component is <Outlet />." }
          ],
          correctAnswer: "A",
          explanationNote: "In React Router v6, parent layout routes render an <Outlet /> element where matched child routes are displayed."
        }
      },
      {
        heading: "Handling 404 Not Found Routes",
        text: "A route with path='*' acts as a catch-all wildcard that matches any URL that does not match an earlier route, displaying a 404 message.",
        codeSnippet: `<Routes>\n  <Route path="/" element={<Home />} />\n  <Route path="/notes" element={<Notes />} />\n  <Route path="*" element={<NotFound />} />\n</Routes>`,
        mcq: {
          id: "q-7.1-4-v1",
          question: "What does <Route path='*' element={<NotFound />} /> do in React Router v6?",
          options: [
            { id: "A", text: "It acts as a fallback route that catches any URL that does not match any other defined route", explanationIfWrong: "The asterisk wildcard matches any otherwise unmatched URL." },
            { id: "B", text: "It disables all other routes in the application", explanationIfWrong: "It only matches if no earlier, more specific route matches." },
            { id: "C", text: "It deletes the user's browser history", explanationIfWrong: "Wildcard routes render fallback components safely." },
            { id: "D", text: "It redirects all users to Google", explanationIfWrong: "It renders the specified NotFound component." }
          ],
          correctAnswer: "A",
          explanationNote: "The '*' wildcard matches any route. When placed in <Routes>, it catches all unrecognized URLs, rendering a friendly 404 Not Found view."
        },
        retestMcq: {
          id: "q-7.1-4-v2",
          question: "Does a 404 route defined with path='*' in React Router cause the server to return an HTTP status code 404?",
          options: [
            { id: "A", text: "No, client-side routing happens entirely in the browser; the HTTP status code from the server was 200 when index.html loaded", explanationIfWrong: "Client-side routing renders a 404 UI component, but the initial HTML document request was 200." },
            { id: "B", text: "Yes, the browser automatically changes its HTTP response code to 404", explanationIfWrong: "Browsers cannot retroactively alter HTTP response headers of loaded pages." },
            { id: "C", text: "Yes, MongoDB sends a 404 error code", explanationIfWrong: "Client routing does not interact with MongoDB." },
            { id: "D", text: "Only if the user is using Safari", explanationIfWrong: "Client-side routing works the same across all modern browsers." }
          ],
          correctAnswer: "A",
          explanationNote: "In SPAs, the server returns 200 with index.html for all routes. The 404 view is rendered in the browser UI by React Router, not as an HTTP 404 status header."
        }
      },
      {
        heading: "Styling Active Navigation Links",
        text: "The NavLink component knows whether its target URL is currently active, allowing dynamic CSS class or style assignment for active links.",
        codeSnippet: `import { NavLink } from 'react-router-dom';\n\n<NavLink\n  to="/notes"\n  className={({ isActive }) => isActive ? 'font-bold text-primary' : 'text-slate'}\n>\n  Notes\n</NavLink>`,
        mcq: {
          id: "q-7.1-5-v1",
          question: "What is the difference between <NavLink> and <Link> in React Router?",
          options: [
            { id: "A", text: "<NavLink> provides an 'isActive' boolean property in its className/style functions to highlight the link when the current URL matches its destination", explanationIfWrong: "NavLink adds awareness of whether the link's route is currently active." },
            { id: "B", text: "<NavLink> can only be used on mobile devices", explanationIfWrong: "NavLink works on all platforms." },
            { id: "C", text: "<Link> does not support URLs", explanationIfWrong: "Both take a 'to' prop specifying the URL." },
            { id: "D", text: "<NavLink> connects to the database directly", explanationIfWrong: "NavLink is an enhanced navigation link component." }
          ],
          correctAnswer: "A",
          explanationNote: "NavLink is a specialized Link that provides an isActive parameter, allowing components to highlight or style active menu items automatically."
        },
        retestMcq: {
          id: "q-7.1-5-v2",
          question: "By default, what CSS class name does <NavLink> automatically add to the anchor element when active?",
          options: [
            { id: "A", text: "'active'", explanationIfWrong: "By default, React Router adds class='active' to active NavLink elements." },
            { id: "B", text: "'selected-nav-item'", explanationIfWrong: "The default class name is simply 'active'." },
            { id: "C", text: "'highlighted'", explanationIfWrong: "React Router uses 'active'." },
            { id: "D", text: "'current-page-true'", explanationIfWrong: "The default class is 'active'." }
          ],
          correctAnswer: "A",
          explanationNote: "Unless customized via the className callback, <NavLink> automatically applies the standard CSS class name 'active' when matching the URL."
        }
      }
    ]
  },
  {
    id: "7-2-route-params-useparams-navigate",
    number: "7.2",
    title: "Route Parameters: useParams & useNavigate",
    subtitle: "Extract dynamic URL segments with useParams, inspect query parameters with useSearchParams, and navigate programmatically using useNavigate.",
    readTime: "13 min",
    objectives: [
      "Define parameterized routes using colon syntax (e.g. /notes/:id)",
      "Extract route parameters inside components using the useParams hook",
      "Find and render specific entity details based on URL parameters",
      "Perform programmatic redirection using the useNavigate hook",
      "Read and modify URL query strings using useSearchParams",
      "Use useMatch to extract parameters at the parent Router level"
    ],
    theoryBlocks: [
      {
        heading: "Parameterized Routes (:id)",
        text: "Colons denote parameterized path segments, allowing a single route definition to match any dynamic entity ID (e.g. /notes/1, /notes/2).",
        codeSnippet: `<Routes>\n  <Route path="/notes/:id" element={<NoteDetail />} />\n</Routes>`,
        mcq: {
          id: "q-7.2-0-v1",
          question: "What does the colon in path='/notes/:id' represent in a React Router route definition?",
          options: [
            { id: "A", text: "It defines a dynamic route parameter named 'id' that matches any value in that URL segment", explanationIfWrong: "Colons define variable URL segments accessible via useParams()." },
            { id: "B", text: "It indicates that the route is password-protected", explanationIfWrong: "Colons indicate dynamic path parameters, not security credentials." },
            { id: "C", text: "It tells React to render the component twice", explanationIfWrong: "Colons specify parameter names." },
            { id: "D", text: "It converts the URL into Roman numerals", explanationIfWrong: "Colon syntax is standard routing notation for variables." }
          ],
          correctAnswer: "A",
          explanationNote: "Prefixing a path segment with ':' designates it as a dynamic parameter. Visiting /notes/123 binds '123' to the parameter name 'id'."
        },
        retestMcq: {
          id: "q-7.2-0-v2",
          question: "Which of the following URLs will match the route <Route path='/blogs/:blogId' element={<Blog />} />?",
          options: [
            { id: "A", text: "/blogs/5a422a851b54a676234d17f7", explanationIfWrong: "The dynamic segment matches any arbitrary ID string." },
            { id: "B", text: "/blogs", explanationIfWrong: "Missing the required parameter segment." },
            { id: "C", text: "/users/5a422a851b54a676234d17f7", explanationIfWrong: "The base prefix is /blogs, not /users." },
            { id: "D", text: "/blogs/1/comments/2", explanationIfWrong: "This has too many path segments for a single parameter route." }
          ],
          correctAnswer: "A",
          explanationNote: "path='/blogs/:blogId' matches any path consisting of '/blogs/' followed by exactly one dynamic segment."
        }
      },
      {
        heading: "Extracting Parameters with useParams",
        text: "The useParams hook returns an object of key/value pairs of URL parameters from the current URL matching the <Route path>.",
        codeSnippet: `import { useParams } from 'react-router-dom';\n\nconst NoteDetail = ({ notes }) => {\n  const { id } = useParams();\n  const note = notes.find(n => n.id === Number(id));\n  if (!note) return <p>Note not found</p>;\n  return <div><h2>{note.content}</h2></div>;\n};`,
        mcq: {
          id: "q-7.2-1-v1",
          question: "What data type are parameter values returned by useParams()?",
          options: [
            { id: "A", text: "Strings (e.g. '123')", explanationIfWrong: "URL segments are always parsed as strings, so numeric IDs must be cast with Number()." },
            { id: "B", text: "Numbers (e.g. 123)", explanationIfWrong: "URLs are text; useParams always returns string values." },
            { id: "C", text: "Booleans", explanationIfWrong: "Parameters are strings." },
            { id: "D", text: "ArrayBuffers", explanationIfWrong: "useParams returns string key-value pairs." }
          ],
          correctAnswer: "A",
          explanationNote: "Because URLs are text strings, useParams() always returns string values. If comparing against numeric IDs, cast with Number(id) or parseInt()."
        },
        retestMcq: {
          id: "q-7.2-1-v2",
          question: "If the route is /users/:userId/posts/:postId and the URL is /users/42/posts/101, what does useParams() return?",
          options: [
            { id: "A", text: "{ userId: '42', postId: '101' }", explanationIfWrong: "useParams maps each named parameter to its URL segment value as strings." },
            { id: "B", text: "['42', '101']", explanationIfWrong: "useParams returns an object with parameter names as keys." },
            { id: "C", text: "{ id: 42101 }", explanationIfWrong: "Keys match the exact parameter names declared in the route path." },
            { id: "D", text: "null", explanationIfWrong: "useParams returns an object with the extracted parameter pairs." }
          ],
          correctAnswer: "A",
          explanationNote: "useParams extracts all named parameters from the URL into an object where keys correspond to the route parameter names."
        }
      },
      {
        heading: "Programmatic Navigation with useNavigate",
        text: "The useNavigate hook returns a function that lets you navigate programmatically (e.g. redirecting after login or form submission).",
        codeSnippet: `import { useNavigate } from 'react-router-dom';\n\nconst LoginForm = () => {\n  const navigate = useNavigate();\n  const handleSubmit = async (event) => {\n    event.preventDefault();\n    await loginUser();\n    navigate('/dashboard'); // Programmatic navigation!\n  };\n  return (/* form */);\n};`,
        mcq: {
          id: "q-7.2-2-v1",
          question: "When should useNavigate be used instead of a declarative <Link> component?",
          options: [
            { id: "A", text: "When navigation needs to occur programmatically inside JavaScript code (e.g. after an async API call resolves or on timeout)", explanationIfWrong: "useNavigate is for programmatic transitions initiated from code logic." },
            { id: "B", text: "When rendering static navigation menus", explanationIfWrong: "Static menus should use declarative <Link> or <NavLink> components." },
            { id: "C", text: "To send email newsletters", explanationIfWrong: "useNavigate manages browser URL routing." },
            { id: "D", text: "Only when the user clicks 'Cancel'", explanationIfWrong: "It can navigate anywhere in response to any code logic." }
          ],
          correctAnswer: "A",
          explanationNote: "useNavigate() enables programmatic navigation triggered by code execution, such as redirecting a user to their dashboard upon successful authentication."
        },
        retestMcq: {
          id: "q-7.2-2-v2",
          question: "How can you navigate back one step in browser history using the navigate function?",
          options: [
            { id: "A", text: "navigate(-1)", explanationIfWrong: "Passing -1 to navigate steps back one entry in the browser history stack (like clicking the browser Back button)." },
            { id: "B", text: "navigate('back')", explanationIfWrong: "The numeric delta -1 is the standard argument for going back." },
            { id: "C", text: "navigate.previous()", explanationIfWrong: "navigate is a callable function taking delta numbers or path strings." },
            { id: "D", text: "navigate.pop()", explanationIfWrong: "Passing -1 is the correct method." }
          ],
          correctAnswer: "A",
          explanationNote: "Calling navigate(-1) navigates one step backward in the browser history stack, identical to clicking the browser's Back button."
        }
      },
      {
        heading: "Extracting Matches with useMatch",
        text: "useMatch('/notes/:id') allows components at the router root to check if the current URL matches a pattern and read parameters before rendering.",
        codeSnippet: `const match = useMatch('/notes/:id');\nconst note = match\n  ? notes.find(n => n.id === Number(match.params.id))\n  : null;\n\nreturn (\n  <Routes>\n    <Route path="/notes/:id" element={<Note note={note} />} />\n  </Routes>\n);`,
        mcq: {
          id: "q-7.2-3-v1",
          question: "What is the primary benefit of using useMatch() in the parent component containing <Routes>?",
          options: [
            { id: "A", text: "It allows finding the targeted entity at the top level and passing the resolved object as a prop directly to the routed component", explanationIfWrong: "useMatch lets the parent resolve the entity before rendering the route element." },
            { id: "B", text: "It eliminates the need for BrowserRouter", explanationIfWrong: "BrowserRouter is still required." },
            { id: "C", text: "It replaces all MongoDB database queries", explanationIfWrong: "useMatch is a client-side URL matcher." },
            { id: "D", text: "It converts React components into Angular modules", explanationIfWrong: "useMatch is a standard React Router hook." }
          ],
          correctAnswer: "A",
          explanationNote: "useMatch allows extracting route parameters at the App level, finding the corresponding data item from state, and passing it as a simple prop to the child component."
        },
        retestMcq: {
          id: "q-7.2-3-v2",
          question: "What does useMatch('/notes/:id') return if the user is currently on the home page '/'?",
          options: [
            { id: "A", text: "null", explanationIfWrong: "useMatch returns null if the current location does not match the provided path pattern." },
            { id: "B", text: "An empty object {}", explanationIfWrong: "It returns null on mismatch." },
            { id: "C", text: "undefined", explanationIfWrong: "React Router returns null when there is no match." },
            { id: "D", text: "Throws an unhandled exception", explanationIfWrong: "useMatch safely returns null without throwing." }
          ],
          correctAnswer: "A",
          explanationNote: "If the current URL pathname does not match the pattern passed to useMatch, it returns null."
        }
      },
      {
        heading: "Query Strings with useSearchParams",
        text: "The useSearchParams hook reads and modifies URL query strings (e.g. ?sort=name&order=asc) similar to useState.",
        codeSnippet: `import { useSearchParams } from 'react-router-dom';\n\nconst SearchPage = () => {\n  const [searchParams, setSearchParams] = useSearchParams();\n  const query = searchParams.get('q');\n  return <div>Searching for: {query}</div>;\n};`,
        mcq: {
          id: "q-7.2-4-v1",
          question: "How do you read the value of a specific query parameter (e.g. '?q=react') using searchParams?",
          options: [
            { id: "A", text: "searchParams.get('q')", explanationIfWrong: "useSearchParams returns a URLSearchParams instance, whose .get(key) method retrieves values." },
            { id: "B", text: "searchParams.q", explanationIfWrong: "searchParams is an instance of URLSearchParams, requiring the .get() method." },
            { id: "C", text: "searchParams[0]", explanationIfWrong: "Values are accessed by parameter key name using .get()." },
            { id: "D", text: "searchParams.query('q')", explanationIfWrong: "The standard method is .get('key')." }
          ],
          correctAnswer: "A",
          explanationNote: "searchParams is a standard web URLSearchParams object. Calling searchParams.get('q') returns the string value associated with 'q'."
        },
        retestMcq: {
          id: "q-7.2-4-v2",
          question: "How does updating query parameters with setSearchParams({ sort: 'date' }) affect the browser?",
          options: [
            { id: "A", text: "It updates the URL query string to '?sort=date' without reloading the page, re-rendering components using that searchParam", explanationIfWrong: "setSearchParams updates the query string reactively without full page reloads." },
            { id: "B", text: "It deletes the database collection", explanationIfWrong: "URL query parameters have no direct connection to database deletion." },
            { id: "C", text: "It shuts down the web server", explanationIfWrong: "It only modifies the client browser URL string." },
            { id: "D", text: "It opens a new browser window", explanationIfWrong: "Navigation occurs inside the current window." }
          ],
          correctAnswer: "A",
          explanationNote: "Calling setSearchParams updates the URL query string reactively in the address bar without triggering a page reload."
        }
      },
      {
        heading: "Protected Route Redirection",
        text: "Using conditional navigation or the <Navigate replace to='...' /> component redirects unauthenticated users away from protected pages.",
        codeSnippet: `const Users = ({ user }) => {\n  if (!user) {\n    return <Navigate replace to="/login" />;\n  }\n  return <h2>User Administration Panel</h2>;\n};`,
        mcq: {
          id: "q-7.2-5-v1",
          question: "What does <Navigate replace to='/login' /> do when rendered in a component?",
          options: [
            { id: "A", text: "It immediately navigates the user to '/login', replacing the current history entry so the Back button doesn't loop back to the protected page", explanationIfWrong: "replace overwrites the current history entry rather than appending." },
            { id: "B", text: "It sends an alert to the system administrator", explanationIfWrong: "It is a standard React Router client-side redirection element." },
            { id: "C", text: "It forces the user to reset their password", explanationIfWrong: "It merely navigates to the login page." },
            { id: "D", text: "It deletes all cookies", explanationIfWrong: "Navigation does not delete cookies." }
          ],
          correctAnswer: "A",
          explanationNote: "Rendering <Navigate replace to='/login' /> redirects the browser to /login immediately. Using replace prevents the back button from returning to the unauthorized page."
        },
        retestMcq: {
          id: "q-7.2-5-v2",
          question: "Why is client-side route protection alone NOT sufficient for securing application data?",
          options: [
            { id: "A", text: "Client-side code can be inspected and bypassed in the browser; the backend API must always enforce token authorization on all sensitive endpoints", explanationIfWrong: "True security must be enforced by backend servers; client routing only guards the UI." },
            { id: "B", text: "Because React Router is an insecure open-source library", explanationIfWrong: "React Router is secure; the issue is that client code cannot be trusted by definition." },
            { id: "C", text: "Because browsers cannot store passwords", explanationIfWrong: "Backend authorization is the bedrock of application security." },
            { id: "D", text: "Because MongoDB Atlas requires Java", explanationIfWrong: "Backend security requires server-side token checks on every request." }
          ],
          correctAnswer: "A",
          explanationNote: "Frontend route guarding is purely for user experience. Real security is enforced on the server, which validates JWT tokens before providing any protected data."
        }
      }
    ]
  },
  {
    id: "7-3-custom-hooks",
    number: "7.3",
    title: "Custom Hooks & Logic Reusability",
    subtitle: "Create custom React hooks starting with 'use', abstract stateful input and resource logic, and build reusable full stack abstractions.",
    readTime: "12 min",
    objectives: [
      "Understand the rules and naming conventions for custom React hooks",
      "Build a custom useField hook to manage form inputs cleanly",
      "Spread hook properties directly onto JSX input elements (...inputProps)",
      "Build a custom useResource hook for generic REST API synchronization",
      "Abstract localStorage synchronization into a useLocalStorage hook",
      "Separate reusable stateful logic from UI rendering components"
    ],
    theoryBlocks: [
      {
        heading: "What is a Custom Hook?",
        text: "A custom hook is a JavaScript function whose name starts with 'use' and that calls other React hooks (like useState or useEffect) to encapsulate stateful logic.",
        codeSnippet: `// Custom Counter Hook:\nconst useCounter = () => {\n  const [value, setValue] = useState(0);\n  const increase = () => setValue(value + 1);\n  const decrease = () => setValue(value - 1);\n  const zero = () => setValue(0);\n  return { value, increase, decrease, zero };\n};`,
        mcq: {
          id: "q-7.3-0-v1",
          question: "What naming convention MUST all custom React hooks follow?",
          options: [
            { id: "A", text: "Their names must start with the lowercase word 'use' (e.g. useCounter, useField)", explanationIfWrong: "The 'use' prefix enables React's linter to enforce the Rules of Hooks." },
            { id: "B", text: "Their names must end with '_hook'", explanationIfWrong: "React requires the prefix 'use', not a suffix." },
            { id: "C", text: "They must be written in ALL_CAPS", explanationIfWrong: "Hook names use camelCase starting with 'use'." },
            { id: "D", text: "Their names must start with 'get'", explanationIfWrong: "The required prefix is 'use'." }
          ],
          correctAnswer: "A",
          explanationNote: "React relies on the 'use' prefix (e.g. useField, useResource) to automatically verify and enforce the Rules of Hooks (e.g. not calling hooks inside loops or conditions)."
        },
        retestMcq: {
          id: "q-7.3-0-v2",
          question: "Do two components using the same custom hook share the exact same state?",
          options: [
            { id: "A", text: "No, each call to a custom hook creates completely isolated, independent state for that specific component instance", explanationIfWrong: "Custom hooks share stateful logic, not the state data itself." },
            { id: "B", text: "Yes, custom hooks act as global singletons sharing state across all components", explanationIfWrong: "Custom hooks instantiate new local state for each caller; Context or Redux is used for shared state." },
            { id: "C", text: "Yes, but only if they are rendered in the same tab", explanationIfWrong: "Each component instance has its own isolated hook state." },
            { id: "D", text: "Only if the hook returns an array", explanationIfWrong: "State isolation is fundamental to React hooks regardless of return type." }
          ],
          correctAnswer: "A",
          explanationNote: "Custom hooks reuse stateful logic, not state itself. Each component calling useCounter() receives its own private value and setter."
        }
      },
      {
        heading: "The useField Form Hook",
        text: "The useField hook encapsulates input type, value, and onChange handlers, reducing form inputs to single-line declarations.",
        codeSnippet: `const useField = (type) => {\n  const [value, setValue] = useState('');\n  const onChange = (event) => setValue(event.target.value);\n  const reset = () => setValue('');\n  return { type, value, onChange, reset };\n};`,
        mcq: {
          id: "q-7.3-1-v1",
          question: "What properties does the useField hook return that match native HTML <input> attributes?",
          options: [
            { id: "A", text: "type, value, and onChange", explanationIfWrong: "These three properties allow spread syntax directly onto input elements." },
            { id: "B", text: "databaseUri, password, and port", explanationIfWrong: "useField manages client DOM input state." },
            { id: "C", text: "className, id, and style", explanationIfWrong: "The core input synchronization properties are type, value, and onChange." },
            { id: "D", text: "GET, POST, and DELETE", explanationIfWrong: "These are HTTP verbs, not input attributes." }
          ],
          correctAnswer: "A",
          explanationNote: "Returning type, value, and onChange allows components to bind all necessary input properties effortlessly in JSX."
        },
        retestMcq: {
          id: "q-7.3-1-v2",
          question: "How can the properties of a useField hook (named nameInput) be bound to an <input> element cleanly?",
          options: [
            { id: "A", text: "<input type={nameInput.type} value={nameInput.value} onChange={nameInput.onChange} />", explanationIfWrong: "Binding these attributes connects the input directly to the hook state." },
            { id: "B", text: "<input hook={nameInput} />", explanationIfWrong: "HTML inputs do not have a 'hook' attribute." },
            { id: "C", text: "<input state='useField' />", explanationIfWrong: "Individual input attributes must be bound." },
            { id: "D", text: "nameInput.render()", explanationIfWrong: "useField returns properties, not a render method." }
          ],
          correctAnswer: "A",
          explanationNote: "Binding type, value, and onChange connects the input to the hook, ensuring controlled form input synchronization."
        }
      },
      {
        heading: "Spread Syntax with Hooks",
        text: "Using object spread syntax (...inputProps) binds all matching input attributes at once, but helper functions like reset must be omitted from DOM spread.",
        codeSnippet: `const name = useField('text');\n\n// Omitting reset before spreading onto DOM:\nconst { reset: resetName, ...nameInput } = name;\n\nreturn (\n  <form>\n    <input {...nameInput} />\n    <button type="button" onClick={resetName}>Reset</button>\n  </form>\n);`,
        mcq: {
          id: "q-7.3-2-v1",
          question: "Why must the 'reset' function be separated before spreading {...nameInput} onto a native <input> element?",
          options: [
            { id: "A", text: "Standard HTML <input> elements do not have a valid 'reset' attribute; passing functions as invalid DOM attributes triggers a React console warning", explanationIfWrong: "React warns against spreading unrecognized non-standard attributes onto DOM elements." },
            { id: "B", text: "Because spreading reset causes the computer to shut down", explanationIfWrong: "It simply causes an invalid DOM attribute warning." },
            { id: "C", text: "Because reset is a reserved keyword in JavaScript", explanationIfWrong: "reset is an arbitrary function name." },
            { id: "D", text: "Because the input field will turn invisible", explanationIfWrong: "The input renders, but React warns about invalid DOM attributes." }
          ],
          correctAnswer: "A",
          explanationNote: "Spreading an object containing non-standard DOM properties (like reset) onto a native <input> triggers a React warning: 'Invalid DOM property `reset`'."
        },
        retestMcq: {
          id: "q-7.3-2-v2",
          question: "How does destructuring const { reset, ...inputProps } = useField('text') solve this warning?",
          options: [
            { id: "A", text: "It isolates 'reset' into a separate variable and gathers only type, value, and onChange into 'inputProps' for safe spreading", explanationIfWrong: "Rest destructuring cleanly separates domain helpers from native DOM attributes." },
            { id: "B", text: "It converts reset into a CSS stylesheet", explanationIfWrong: "It extracts the function into a local variable." },
            { id: "C", text: "It deletes the input from the document", explanationIfWrong: "It keeps the input clean and valid." },
            { id: "D", text: "It forces reset to run on every render", explanationIfWrong: "It simply decouples the helper from the DOM spread object." }
          ],
          correctAnswer: "A",
          explanationNote: "Destructuring pulls out 'reset', leaving only valid HTML attributes (type, value, onChange) inside inputProps to spread cleanly onto <input {...inputProps} />."
        }
      },
      {
        heading: "The useResource API Hook",
        text: "The useResource hook abstracts full CRUD operations for an API endpoint, returning the resources array and service functions.",
        codeSnippet: `const useResource = (baseUrl) => {\n  const [resources, setResources] = useState([]);\n  useEffect(() => {\n    axios.get(baseUrl).then(res => setResources(res.data));\n  }, [baseUrl]);\n  const create = async (newObj) => {\n    const res = await axios.post(baseUrl, newObj);\n    setResources(resources.concat(res.data));\n  };\n  return [resources, { create }];\n};`,
        mcq: {
          id: "q-7.3-3-v1",
          question: "How can useResource be reused for different backend entities in the same application?",
          options: [
            { id: "A", text: "Call it with different base URLs: const [notes, noteService] = useResource('/api/notes') and const [persons, personService] = useResource('/api/persons')", explanationIfWrong: "Parameterized URLs make the resource hook reusable across any REST endpoint." },
            { id: "B", text: "Copy and paste the hook code into 50 different files", explanationIfWrong: "Hooks are meant to be reused through parameters, not duplicated." },
            { id: "C", text: "It cannot be reused; hooks only work for one database collection", explanationIfWrong: "Custom hooks are standard reusable JavaScript functions." },
            { id: "D", text: "By rewriting the backend in Python", explanationIfWrong: "The hook is client-side React code." }
          ],
          correctAnswer: "A",
          explanationNote: "By passing different endpoint URLs (e.g. '/api/notes', '/api/persons'), a single useResource hook can manage multiple distinct backend resources seamlessly."
        },
        retestMcq: {
          id: "q-7.3-3-v2",
          question: "Why is baseUrl included in the useEffect dependency array inside useResource?",
          options: [
            { id: "A", text: "To re-fetch data if the baseUrl parameter ever changes, and to satisfy React's exhaustive-deps lint rule", explanationIfWrong: "External variables used inside effects must be declared in dependencies." },
            { id: "B", text: "To encrypt the URL", explanationIfWrong: "Dependency arrays control execution timing, not encryption." },
            { id: "C", text: "To clear the database", explanationIfWrong: "It ensures the effect responds to URL changes." },
            { id: "D", text: "Because React crashes if dependency arrays have fewer than 2 items", explanationIfWrong: "Dependency arrays can have any number of items." }
          ],
          correctAnswer: "A",
          explanationNote: "Any reactive variable used inside an effect must be included in its dependency array to ensure the effect re-runs if that value changes."
        }
      },
      {
        heading: "The Rules of Hooks",
        text: "Hooks must only be called at the top level of React function components or custom hooks, never inside loops, conditions, or nested functions.",
        codeSnippet: `// ❌ VIOLATION: Calling hooks inside a condition\nif (condition) {\n  const [val, setVal] = useState(0); // BANNED!\n}\n\n// ✅ CORRECT: Always call hooks at the top level\nconst [val, setVal] = useState(0);`,
        mcq: {
          id: "q-7.3-4-v1",
          question: "Why must React hooks NEVER be called inside loops, conditions, or nested functions?",
          options: [
            { id: "A", text: "React relies on the exact call order of hooks across renders to preserve state across multiple useState and useEffect calls", explanationIfWrong: "React tracks hook state internally by call index order." },
            { id: "B", text: "Because JavaScript syntax does not allow if statements with functions", explanationIfWrong: "JavaScript allows conditions anywhere; React's internal design requires consistent call order." },
            { id: "C", text: "Because loops delete memory in browsers", explanationIfWrong: "Loops run normally; call order stability is the constraint." },
            { id: "D", text: "Because hooks only work on Tuesday", explanationIfWrong: "Hooks operate continuously subject to call order rules." }
          ],
          correctAnswer: "A",
          explanationNote: "React tracks state by the execution order of hooks. If a hook call is conditional, the order changes between renders, corrupting internal state pointers."
        },
        retestMcq: {
          id: "q-7.3-4-v2",
          question: "What tool automatically warns developers if the Rules of Hooks are violated during development?",
          options: [
            { id: "A", text: "eslint-plugin-react-hooks", explanationIfWrong: "The ESLint plugin checks that hooks are called unconditionally at the top level." },
            { id: "B", text: "MongoDB Compass", explanationIfWrong: "Compass is a GUI for MongoDB, not a code linter." },
            { id: "C", text: "Postman API client", explanationIfWrong: "Postman tests HTTP endpoints." },
            { id: "D", text: "Docker container engine", explanationIfWrong: "Docker manages OS containers." }
          ],
          correctAnswer: "A",
          explanationNote: "The official eslint-plugin-react-hooks enforces the Rules of Hooks at build and edit time, catching illegal conditional hook calls immediately."
        }
      },
      {
        heading: "Publishing Custom Hooks as Packages",
        text: "Well-designed custom hooks can be published to npm or shared across projects, creating reusable open-source component logic ecosystems.",
        codeSnippet: `// Example popular open-source hook libraries:\n// - usehooks-ts\n// - @uidotdev/usehooks\n// - react-use`,
        mcq: {
          id: "q-7.3-5-v1",
          question: "What makes custom hooks especially well-suited for sharing across multiple projects?",
          options: [
            { id: "A", text: "They package pure stateful logic without imposing any specific HTML structure or CSS styling, giving consumers complete UI freedom", explanationIfWrong: "Custom hooks share behavior without constraining presentation." },
            { id: "B", text: "They automatically install Node.js on end-user phones", explanationIfWrong: "Hooks are frontend JavaScript code." },
            { id: "C", text: "They bypass all copyright laws", explanationIfWrong: "Open-source packages use standard software licenses." },
            { id: "D", text: "They only work when offline", explanationIfWrong: "Hooks work both online and offline." }
          ],
          correctAnswer: "A",
          explanationNote: "Custom hooks provide headless logic: they manage behavior, state, and events while leaving UI layout, HTML tags, and styling entirely to the consumer."
        },
        retestMcq: {
          id: "q-7.3-5-v2",
          question: "Which of the following is an example of a headless custom hook?",
          options: [
            { id: "A", text: "useWindowSize() which returns { width, height } updated on browser resize without rendering any DOM elements", explanationIfWrong: "useWindowSize manages resize state and listeners without rendering HTML." },
            { id: "B", text: "A <div> tag with red background", explanationIfWrong: "A div is a visual DOM element, not a hook." },
            { id: "C", text: "A CSS file containing font definitions", explanationIfWrong: "CSS files are stylesheets." },
            { id: "D", text: "A PNG image logo", explanationIfWrong: "Images are media assets." }
          ],
          correctAnswer: "A",
          explanationNote: "useWindowSize() is headless: it manages the window resize event listener and returns reactive width/height data without producing any JSX markup."
        }
      }
    ]
  },
  {
    id: "7-4-styling-ui-frameworks",
    number: "7.4",
    title: "Styling React Apps: UI Frameworks & CSS",
    subtitle: "Style applications using UI libraries like Bootstrap and Material UI, write component-scoped styles with styled-components, and use Tailwind CSS.",
    readTime: "12 min",
    objectives: [
      "Style React components using component libraries (React Bootstrap, Material UI)",
      "Understand the benefits and trade-offs of UI component frameworks",
      "Write scoped component styling using the styled-components library",
      "Use Utility-first CSS frameworks like Tailwind CSS",
      "Style navigation bars, tables, form inputs, and notification alerts",
      "Choose the appropriate styling approach for project requirements"
    ],
    theoryBlocks: [
      {
        heading: "UI Frameworks: React Bootstrap & MUI",
        text: "Component libraries like React Bootstrap and Material UI (MUI) provide pre-built, accessible UI elements like Navbars, Tables, Buttons, and Modals.",
        codeSnippet: `import { Table, Form, Button, Alert } from 'react-bootstrap';\n\n// Usage in component:\n<Table striped>\n  <tbody>\n    {notes.map(note => <tr key={note.id}><td>{note.content}</td></tr>)}\n  </tbody>\n</Table>`,
        mcq: {
          id: "q-7.4-0-v1",
          question: "What is the primary benefit of using a UI framework like React Bootstrap or Material UI?",
          options: [
            { id: "A", text: "Rapid development with polished, accessible, responsive components that work consistently across all browsers out of the box", explanationIfWrong: "UI libraries provide ready-made accessible components, speeding up development." },
            { id: "B", text: "They eliminate the need for JavaScript in React applications", explanationIfWrong: "UI frameworks are written in JavaScript/TypeScript for React." },
            { id: "C", text: "They replace backend database storage", explanationIfWrong: "UI frameworks handle presentation, not database storage." },
            { id: "D", text: "They make the internet 10 times faster", explanationIfWrong: "They provide pre-styled UI components." }
          ],
          correctAnswer: "A",
          explanationNote: "UI frameworks offer ready-to-use, polished, accessible, and responsive components, drastically reducing the time spent writing custom CSS from scratch."
        },
        retestMcq: {
          id: "q-7.4-0-v2",
          question: "What trade-off comes with using heavy UI component libraries like Material UI?",
          options: [
            { id: "A", text: "Larger bundle sizes and potentially difficult custom styling overrides if your design departs from the framework's default theme", explanationIfWrong: "Heavy libraries add bundle weight and can be tedious to override." },
            { id: "B", text: "They cannot be used with React Router", explanationIfWrong: "UI libraries work seamlessly with React Router." },
            { id: "C", text: "They only render in black and white", explanationIfWrong: "They support rich themes and color palettes." },
            { id: "D", text: "They require servers running Windows 95", explanationIfWrong: "They run in any modern web browser." }
          ],
          correctAnswer: "A",
          explanationNote: "UI libraries increase bundle size and can be difficult to customize when projects require unique branding that conflicts with the library's design system."
        }
      },
      {
        heading: "Scoped Styling with styled-components",
        text: "The styled-components library uses tagged template literals to style components directly in JavaScript, scoping styles strictly to that component.",
        codeSnippet: `import styled from 'styled-components';\n\nconst Button = styled.button\`\n  background: Bisque;\n  font-size: 1em;\n  margin: 1em;\n  padding: 0.25em 1em;\n  border: 2px solid Chocolate;\n  border-radius: 3px;\n\`;\n\n// Usage in JSX:\n<Button onClick={handleClick}>Click Me</Button>`,
        mcq: {
          id: "q-7.4-1-v1",
          question: "How does styled-components prevent CSS class name collisions between different components?",
          options: [
            { id: "A", text: "It generates unique, hashed CSS class names for each styled component at runtime (e.g. class='sc-bdVaJa bWjXwS')", explanationIfWrong: "Automatic hash generation ensures styles never leak or collide." },
            { id: "B", text: "It deletes all other CSS stylesheets from the page", explanationIfWrong: "It safely coexists with other styles." },
            { id: "C", text: "It forces all components to use inline styles exclusively", explanationIfWrong: "It injects real CSS stylesheets with hashed classes, supporting pseudo-classes and media queries." },
            { id: "D", text: "It restricts applications to 1 button per page", explanationIfWrong: "Any number of styled components can be rendered." }
          ],
          correctAnswer: "A",
          explanationNote: "styled-components generates unique hashed class names for each component, ensuring complete style encapsulation with zero global namespace collisions."
        },
        retestMcq: {
          id: "q-7.4-1-v2",
          question: "How can styled-components adapt styling dynamically based on component props?",
          options: [
            { id: "A", text: "By interpolating a function that reads props inside the template string: background: \${props => props.primary ? 'emerald' : 'white'};", explanationIfWrong: "Template literal interpolations receive props to adapt styles dynamically." },
            { id: "B", text: "By calling window.location.reload()", explanationIfWrong: "Dynamic styles update reactively without reloading." },
            { id: "C", text: "By creating a new Git commit", explanationIfWrong: "Prop functions evaluate in JavaScript at render time." },
            { id: "D", text: "Props cannot affect styled-components", explanationIfWrong: "Dynamic prop adaptation is a premier feature of styled-components." }
          ],
          correctAnswer: "A",
          explanationNote: "styled-components accepts functions inside CSS template literals, allowing styles to adjust dynamically based on passed props (e.g. primary={true})."
        }
      },
      {
        heading: "Utility-First CSS with Tailwind CSS",
        text: "Tailwind CSS provides low-level utility classes directly in JSX markup, creating custom designs without writing separate CSS files.",
        codeSnippet: `// Styled with Tailwind CSS utilities:\n<button className="py-2 px-4 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-bold text-xs transition-all shadow-md">\n  Submit\n</button>`,
        mcq: {
          id: "q-7.4-2-v1",
          question: "What is the philosophy of 'Utility-First' CSS frameworks like Tailwind CSS?",
          options: [
            { id: "A", text: "Composing designs by combining small, single-purpose utility classes directly in markup rather than writing custom CSS class definitions", explanationIfWrong: "Utility classes allow styling entirely in markup with zero custom CSS files." },
            { id: "B", text: "Generating 10,000 separate CSS files for every button", explanationIfWrong: "Tailwind purges unused utilities to produce tiny bundles." },
            { id: "C", text: "Forbidding the use of colors in websites", explanationIfWrong: "Tailwind provides extensive color palettes and customization." },
            { id: "D", text: "Replacing JavaScript with Python", explanationIfWrong: "Tailwind is a CSS utility framework." }
          ],
          correctAnswer: "A",
          explanationNote: "Tailwind's utility-first approach builds bespoke designs directly in JSX using atomic classes (like py-2, bg-primary, font-bold), avoiding context-switching to CSS files."
        },
        retestMcq: {
          id: "q-7.4-2-v2",
          question: "How does Tailwind CSS keep production bundle sizes small despite having thousands of utility classes?",
          options: [
            { id: "A", text: "During the production build, it scans your source files and purges/removes any utility class that is not actively used in your code", explanationIfWrong: "Purging unused styles produces production CSS bundles of just a few kilobytes." },
            { id: "B", text: "It compresses all classes into a single GIF image", explanationIfWrong: "It generates real CSS, purged of unused classes." },
            { id: "C", text: "It requires users to download classes over FTP", explanationIfWrong: "CSS is bundled with standard web assets." },
            { id: "D", text: "It only allows 5 colors per application", explanationIfWrong: "Unused utilities are purged, leaving only what is used." }
          ],
          correctAnswer: "A",
          explanationNote: "Tailwind scans templates and purges unused styles during compilation, ensuring only classes actually used in your application are included in the final CSS."
        }
      },
      {
        heading: "CSS Modules",
        text: "CSS Modules allow writing regular CSS files while scoping class names locally to the importing component by appending unique hashes.",
        codeSnippet: `// Button.module.css:\n.errorButton {\n  background-color: red;\n  color: white;\n}\n\n// Button.jsx:\nimport styles from './Button.module.css';\n<button className={styles.errorButton}>Delete</button>`,
        mcq: {
          id: "q-7.4-3-v1",
          question: "How do CSS Modules ensure class names do not clash globally?",
          options: [
            { id: "A", text: "The build tool (Vite or Webpack) transforms class names into uniquely scoped identifiers like 'Button_errorButton__a1b2c'", explanationIfWrong: "Scoped class transformations prevent global namespace contamination." },
            { id: "B", text: "It forces all buttons to use ID selectors instead of classes", explanationIfWrong: "It transforms class names, not IDs." },
            { id: "C", text: "It renames the HTML document", explanationIfWrong: "It hashes class names during compilation." },
            { id: "D", text: "It converts CSS into JSON files", explanationIfWrong: "It produces standard CSS with hashed class names." }
          ],
          correctAnswer: "A",
          explanationNote: "CSS Modules transform class names during build time into unique namespaced strings, giving you standard CSS syntax with zero risk of global collisions."
        },
        retestMcq: {
          id: "q-7.4-3-v2",
          question: "What naming convention signals to Vite or Webpack that a file should be treated as a CSS Module?",
          options: [
            { id: "A", text: "Naming the file with the '.module.css' extension (e.g. Component.module.css)", explanationIfWrong: "The .module.css suffix activates module transformation in bundlers." },
            { id: "B", text: "Naming the file with '.scoped'", explanationIfWrong: "The universal convention is .module.css." },
            { id: "C", text: "Putting the CSS file in the Windows System32 folder", explanationIfWrong: "CSS modules are project source files." },
            { id: "D", text: "Adding // @module at the top of the file", explanationIfWrong: "File extension .module.css is the standard convention." }
          ],
          correctAnswer: "A",
          explanationNote: "Bundlers look for the `.module.css` extension to automatically process the file as a CSS Module, exporting a styles object to JavaScript."
        }
      },
      {
        heading: "Accessibility (a11y) in Component Design",
        text: "Accessible styling ensures sufficient color contrast ratios, clear focus outlines for keyboard navigation, and semantic HTML element usage.",
        codeSnippet: `// Accessible button focus outline:\n<button className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">\n  Save Changes\n</button>`,
        mcq: {
          id: "q-7.4-4-v1",
          question: "Why is it considered bad practice to remove focus outlines with 'outline: none' without providing an alternative focus style?",
          options: [
            { id: "A", text: "Keyboard-only and visually impaired users rely on visible focus indicators to know which element is currently active while tabbing", explanationIfWrong: "Focus rings are essential for keyboard navigation accessibility." },
            { id: "B", text: "Because browsers crash if outline is set to none", explanationIfWrong: "Browsers support it, but it destroys keyboard accessibility." },
            { id: "C", text: "Because outline: none makes buttons 500% larger", explanationIfWrong: "outline does not affect layout geometry." },
            { id: "D", text: "Because Google Chrome bans websites without outlines", explanationIfWrong: "It violates WCAG accessibility guidelines." }
          ],
          correctAnswer: "A",
          explanationNote: "Removing focus outlines without replacement makes a site impossible to navigate for keyboard-only users who rely on visible focus indicators."
        },
        retestMcq: {
          id: "q-7.4-4-v2",
          question: "What does the Web Content Accessibility Guidelines (WCAG) contrast ratio ensure for text and UI elements?",
          options: [
            { id: "A", text: "That text has enough contrast against its background so users with moderate visual impairment can read it easily", explanationIfWrong: "Sufficient contrast is critical for legibility across all lighting conditions." },
            { id: "B", text: "That all buttons are colored bright neon yellow", explanationIfWrong: "Contrast ratio is a mathematical ratio between text and background luminance." },
            { id: "C", text: "That monitors don't use excessive electricity", explanationIfWrong: "WCAG contrast is an accessibility readability guideline." },
            { id: "D", text: "That images load faster on slow mobile networks", explanationIfWrong: "Contrast pertains to visual readability." }
          ],
          correctAnswer: "A",
          explanationNote: "WCAG contrast standards (minimum 4.5:1 for regular text) guarantee that text is distinguishable from its background for people with low vision or in bright sunlight."
        }
      },
      {
        heading: "Choosing the Right Styling Strategy",
        text: "Different projects require different styling tools: Tailwind for custom utility-driven designs, MUI/Bootstrap for rapid prototypes, and CSS Modules for traditional scoped CSS.",
        codeSnippet: `// - Tailwind: Fastest bespoke design with atomic utilities\n// - Component Libraries (MUI, Mantine): Rapid enterprise internal tools\n// - CSS Modules / Styled Components: Traditional CSS with zero global collisions`,
        mcq: {
          id: "q-7.4-5-v1",
          question: "Which styling approach is best suited when building an internal company dashboard that needs dozens of complex tables, datepickers, and modals fast?",
          options: [
            { id: "A", text: "A pre-built component library like Material UI or Ant Design", explanationIfWrong: "Component libraries provide complex widgets (datepickers, tables) pre-built and tested." },
            { id: "B", text: "Writing raw inline styles on every tag by hand", explanationIfWrong: "Inline styles for complex widgets is slow and difficult to maintain." },
            { id: "C", text: "Building a custom browser from scratch", explanationIfWrong: "Web frameworks solve this efficiently." },
            { id: "D", text: "Printing the tables on physical paper", explanationIfWrong: "Pre-built component libraries are ideal for internal dashboards." }
          ],
          correctAnswer: "A",
          explanationNote: "Comprehensive component libraries (MUI, Ant Design, Mantine) shine for internal tools because complex components (date-pickers, data-grids, dialogs) are ready out of the box."
        },
        retestMcq: {
          id: "q-7.4-5-v2",
          question: "When is Tailwind CSS or custom CSS preferred over pre-built component libraries?",
          options: [
            { id: "A", text: "When building consumer-facing products with unique brand identities, pixel-perfect designs, and a need for lightweight, optimized CSS bundles", explanationIfWrong: "Tailwind allows crafting completely bespoke designs without fighting library overrides." },
            { id: "B", text: "When you want all websites to look identical to Twitter in 2012", explanationIfWrong: "That was classic Bootstrap; Tailwind produces unique custom designs." },
            { id: "C", text: "When the application has no users", explanationIfWrong: "Consumer products demand distinctive branding." },
            { id: "D", text: "When writing backend SQL databases", explanationIfWrong: "Tailwind is a frontend CSS framework." }
          ],
          correctAnswer: "A",
          explanationNote: "Tailwind CSS provides complete freedom to implement custom, unique brand designs without being constrained by the pre-baked opinions of a component library."
        }
      }
    ]
  },
  {
    id: "7-5-webpack-bundling-vite",
    number: "7.5",
    title: "Webpack, Vite & Bundling Internals",
    subtitle: "Understand how module bundlers package code, configure Webpack loaders, transpile modern syntax with Babel, and leverage Vite's native ES modules.",
    readTime: "13 min",
    objectives: [
      "Understand what module bundlers do: merging files into browser-ready assets",
      "Configure webpack.config.js from scratch (entry, output, loaders, plugins)",
      "Transpile modern JSX and ES2020+ using Babel (babel-loader and presets)",
      "Process CSS and assets using style-loader and css-loader",
      "Compare traditional Webpack bundling with Vite's modern native ESM dev server",
      "Configure polyfills for backward compatibility with older browsers"
    ],
    theoryBlocks: [
      {
        heading: "The Role of Module Bundlers",
        text: "Module bundlers crawl application import graphs, combine hundreds of modules into optimized bundles, and transpile modern syntax for browser execution.",
        codeSnippet: `// Bundler Workflow:\n// [src/index.js + 100 components + npm packages] ---> (Webpack / Vite) ---> [dist/bundle.js + dist/bundle.css]`,
        mcq: {
          id: "q-7.5-0-v1",
          question: "What is the primary function of a module bundler like Webpack or Vite in frontend development?",
          options: [
            { id: "A", text: "It resolves module import dependencies across your source files and packages them into optimized static assets (JavaScript, CSS, images) for browser execution", explanationIfWrong: "Bundlers package, optimize, and transpile complex module dependency graphs." },
            { id: "B", text: "It manages user accounts on MongoDB Atlas", explanationIfWrong: "Bundlers are build-time compilation tools, not database managers." },
            { id: "C", text: "It sends emails to website visitors", explanationIfWrong: "Bundlers prepare static code for browsers." },
            { id: "D", text: "It deletes the node_modules folder during development", explanationIfWrong: "Bundlers resolve dependencies from node_modules." }
          ],
          correctAnswer: "A",
          explanationNote: "Bundlers trace import/export statements starting from an entry point, bundling all code and dependencies into browser-executable bundles with minification."
        },
        retestMcq: {
          id: "q-7.5-0-v2",
          question: "Can browsers natively execute raw JSX syntax (e.g. <div>Hello</div>) without a build tool?",
          options: [
            { id: "A", text: "No, browsers only understand standard JavaScript; JSX must be transpiled by a compiler like Babel or esbuild into React.createElement calls", explanationIfWrong: "JSX is a syntax extension that must be compiled into standard JavaScript." },
            { id: "B", text: "Yes, all modern browsers natively execute JSX directly", explanationIfWrong: "JSX is not part of standard ECMAScript; it requires compilation." },
            { id: "C", text: "Yes, but only if the file extension is .html", explanationIfWrong: "HTML parsers do not understand JSX syntax." },
            { id: "D", text: "Only in Google Chrome", explanationIfWrong: "No browser natively understands JSX syntax without compilation." }
          ],
          correctAnswer: "A",
          explanationNote: "JSX is not standard JavaScript. Tools like Babel or esbuild must transform JSX tags into standard JavaScript function calls (React.createElement or jsx runtime) before browsers can run them."
        }
      },
      {
        heading: "Webpack Configuration: Entry & Output",
        text: "A webpack.config.js file defines the entry point where bundling begins, and the output path where compiled bundles are written.",
        codeSnippet: `const path = require('path');\n\nmodule.exports = {\n  entry: './src/index.js',\n  output: {\n    path: path.resolve(__dirname, 'build'),\n    filename: 'main.js'\n  }\n};`,
        mcq: {
          id: "q-7.5-1-v1",
          question: "What does the 'entry' property specify in a webpack.config.js file?",
          options: [
            { id: "A", text: "The starting file where Webpack begins traversing the application dependency graph to build its bundle", explanationIfWrong: "entry is the root of the dependency graph." },
            { id: "B", text: "The password required to unlock the build", explanationIfWrong: "entry is a file path, not an authentication secret." },
            { id: "C", text: "The port number of the backend database", explanationIfWrong: "entry defines the frontend source file entry point." },
            { id: "D", text: "The URL of the production website", explanationIfWrong: "entry designates the starting source file on disk." }
          ],
          correctAnswer: "A",
          explanationNote: "The 'entry' property tells Webpack where to begin bundling. Webpack analyzes all imported files starting from that root file."
        },
        retestMcq: {
          id: "q-7.5-1-v2",
          question: "Why is path.resolve(__dirname, 'build') used to define the output directory in Webpack?",
          options: [
            { id: "A", text: "Webpack requires the output path to be an absolute file system path, which path.resolve generates safely across OSes", explanationIfWrong: "Webpack enforces absolute paths for output directories." },
            { id: "B", text: "Because relative paths crash the computer's CPU", explanationIfWrong: "Webpack's configuration schema validates that output.path is absolute." },
            { id: "C", text: "To encrypt the build folder", explanationIfWrong: "path.resolve only computes file path strings." },
            { id: "D", text: "To download the build from GitHub", explanationIfWrong: "It specifies a local directory on disk." }
          ],
          correctAnswer: "A",
          explanationNote: "Webpack strictly requires an absolute directory path for its output directory. Node's path.resolve(__dirname, 'build') constructs a cross-platform absolute path."
        }
      },
      {
        heading: "Loaders: Transpiling with Babel",
        text: "Loaders preprocess non-JavaScript files or modern syntax; babel-loader uses presets (@babel/preset-react, @babel/preset-env) to transpile JSX and modern ES features.",
        codeSnippet: `module: {\n  rules: [\n    {\n      test: /\\.(js|jsx)$/,\n      loader: 'babel-loader',\n      options: {\n        presets: ['@babel/preset-react', '@babel/preset-env']\n      }\n    }\n  ]\n}`,
        mcq: {
          id: "q-7.5-2-v1",
          question: "What is the purpose of @babel/preset-react in Webpack's babel-loader configuration?",
          options: [
            { id: "A", text: "It contains plugins that transform React JSX markup into standard JavaScript function calls", explanationIfWrong: "preset-react specifically handles JSX transformation." },
            { id: "B", text: "It installs React from npm automatically", explanationIfWrong: "Presets are transpilation plugins, not package installers." },
            { id: "C", text: "It styles components with Bootstrap", explanationIfWrong: "Babel transforms JavaScript syntax; it does not style components." },
            { id: "D", text: "It starts the Webpack dev server", explanationIfWrong: "Webpack dev server is a separate tool." }
          ],
          correctAnswer: "A",
          explanationNote: "@babel/preset-react instructs Babel to parse and transpile JSX syntax into regular JavaScript calls that browsers can execute."
        },
        retestMcq: {
          id: "q-7.5-2-v2",
          question: "What does @babel/preset-env do during transpilation?",
          options: [
            { id: "A", text: "It transpiles modern ECMAScript features (ES2020+) down to ES5 syntax so older browsers can run the code", explanationIfWrong: "preset-env ensures backward compatibility with targeted browser versions." },
            { id: "B", text: "It deletes all environment variables", explanationIfWrong: "preset-env transpiles language syntax, not environment variables." },
            { id: "C", text: "It converts JavaScript into Python", explanationIfWrong: "It compiles modern JavaScript into older JavaScript." },
            { id: "D", text: "It checks git status", explanationIfWrong: "Babel is a JavaScript syntax compiler." }
          ],
          correctAnswer: "A",
          explanationNote: "@babel/preset-env automatically determines which JavaScript syntax transformations are needed based on target browser environments, ensuring broad browser compatibility."
        }
      },
      {
        heading: "Handling CSS with css-loader & style-loader",
        text: "css-loader resolves @import and url() inside CSS files, while style-loader injects the bundled CSS into <style> tags in the document head.",
        codeSnippet: `module: {\n  rules: [\n    {\n      test: /\\.css$/,\n      use: ['style-loader', 'css-loader'] // Order matters: evaluated right-to-left!\n    }\n  ]\n}`,
        mcq: {
          id: "q-7.5-3-v1",
          question: "Why must the loaders array be ordered as ['style-loader', 'css-loader']?",
          options: [
            { id: "A", text: "Webpack executes loaders from right-to-left: css-loader resolves CSS imports first, and style-loader injects the result into the DOM", explanationIfWrong: "Webpack loader execution proceeds in reverse order (bottom-to-top / right-to-left)." },
            { id: "B", text: "Because alphabetical order is required by JavaScript", explanationIfWrong: "Loaders follow a reverse execution pipeline order." },
            { id: "C", text: "Because style-loader was written before css-loader in history", explanationIfWrong: "Execution pipeline order dictates this arrangement." },
            { id: "D", text: "The order does not matter", explanationIfWrong: "Reversing the order breaks the build with a syntax error." }
          ],
          correctAnswer: "A",
          explanationNote: "Webpack evaluates loaders in reverse order (right to left). css-loader processes CSS files into JavaScript strings first, then style-loader injects those styles into the document."
        },
        retestMcq: {
          id: "q-7.5-3-v2",
          question: "In production builds, what plugin is typically used instead of style-loader to extract CSS into separate files?",
          options: [
            { id: "A", text: "MiniCssExtractPlugin", explanationIfWrong: "MiniCssExtractPlugin extracts CSS into dedicated .css files for parallel browser downloading." },
            { id: "B", text: "DeleteCssPlugin", explanationIfWrong: "CSS must be preserved, not deleted." },
            { id: "C", text: "HtmlWebpackMinifier", explanationIfWrong: "MiniCssExtractPlugin is the standard tool for external CSS generation." },
            { id: "D", text: "CssToJsonPlugin", explanationIfWrong: "Production builds benefit from external .css files via MiniCssExtractPlugin." }
          ],
          correctAnswer: "A",
          explanationNote: "MiniCssExtractPlugin extracts CSS into separate physical files (main.css) instead of injecting them via JavaScript, enabling browser caching and parallel asset loading."
        }
      },
      {
        heading: "Vite: The Modern Next-Generation Bundler",
        text: "Unlike Webpack which bundles the entire app before starting dev servers, Vite serves native ES modules directly and compiles on-demand with esbuild.",
        codeSnippet: `// Webpack: Bundles whole app -> Starts slow dev server\n// Vite: Serves native ESM instantly -> Fast on-demand compile with esbuild\n// Vite Hot Module Replacement (HMR) is virtually instantaneous!`,
        mcq: {
          id: "q-7.5-4-v1",
          question: "Why is the development server in Vite significantly faster than traditional Webpack dev servers?",
          options: [
            { id: "A", text: "Vite leverages native browser ES Modules (ESM) to serve source files on-demand without pre-bundling the entire project, and uses esbuild (written in Go) for ultra-fast dependency pre-bundling", explanationIfWrong: "Native ESM + Go-based esbuild makes Vite start and update in milliseconds." },
            { id: "B", text: "Because Vite disables JavaScript during development", explanationIfWrong: "Vite executes modern JavaScript natively." },
            { id: "C", text: "Because Vite only allows projects with 1 component", explanationIfWrong: "Vite scales efficiently to thousands of components." },
            { id: "D", text: "Because Vite connects to a supercomputer in Finland", explanationIfWrong: "Vite runs locally utilizing native browser capabilities." }
          ],
          correctAnswer: "A",
          explanationNote: "Vite serves source code over native ESM, compiling individual files on-demand when the browser requests them. Pre-bundling dependencies with Go-based esbuild is 10-100x faster than Webpack."
        },
        retestMcq: {
          id: "q-7.5-4-v2",
          question: "What tool does Vite use for its optimized production builds when you run 'vite build'?",
          options: [
            { id: "A", text: "Rollup", explanationIfWrong: "Vite uses Rollup under the hood for highly optimized production bundling and tree-shaking." },
            { id: "B", text: "Webpack 1.0", explanationIfWrong: "Vite uses Rollup for production builds." },
            { id: "C", text: "Gulp", explanationIfWrong: "Gulp is a legacy task runner." },
            { id: "D", text: "Grunt", explanationIfWrong: "Vite uses Rollup for production builds." }
          ],
          correctAnswer: "A",
          explanationNote: "Vite uses Rollup for production builds, providing mature tree-shaking, code splitting, and asset optimization for production deployment."
        }
      },
      {
        heading: "Polyfills & Core-JS",
        text: "Polyfills provide modern JavaScript APIs (like Promise or Array.prototype.find) to older browsers that lack native implementations.",
        codeSnippet: `// Polyfill setup:\nimport 'core-js/stable';\nimport 'regenerator-runtime/runtime';`,
        mcq: {
          id: "q-7.5-5-v1",
          question: "What is a 'polyfill' in frontend web development?",
          options: [
            { id: "A", text: "Code that implements modern browser features (like Promises, fetch, or Object.assign) on older browsers that lack native support", explanationIfWrong: "Polyfills emulate modern APIs in legacy environments." },
            { id: "B", text: "A 3D graphics rendering algorithm", explanationIfWrong: "Polyfill refers to backward-compatibility feature shims." },
            { id: "C", text: "A database query optimizer", explanationIfWrong: "Polyfills are client-side JavaScript compatibility shims." },
            { id: "D", text: "A password generator", explanationIfWrong: "Polyfills fill missing browser API gaps." }
          ],
          correctAnswer: "A",
          explanationNote: "A polyfill is code that replicates newer browser features in legacy browsers, ensuring modern JavaScript executes without 'undefined is not a function' errors."
        },
        retestMcq: {
          id: "q-7.5-5-v2",
          question: "What is the difference between Babel transpilation and a polyfill?",
          options: [
            { id: "A", text: "Babel transforms syntax (e.g. arrow functions => function), whereas polyfills supply missing global objects and methods (e.g. Promise, fetch, Array.from)", explanationIfWrong: "Transpilation transforms syntax; polyfills define missing runtime APIs." },
            { id: "B", text: "Babel is only for CSS, while polyfills are for HTML", explanationIfWrong: "Both are for JavaScript." },
            { id: "C", text: "They are two names for the exact same function", explanationIfWrong: "Syntax transformation and runtime API emulation are distinct tasks." },
            { id: "D", text: "Polyfills are written in C++, while Babel is written in Python", explanationIfWrong: "Both are JavaScript packages." }
          ],
          correctAnswer: "A",
          explanationNote: "Syntax compilation changes language forms (const => var, () => {} => function), while polyfills patch the runtime environment by providing missing global objects (like Promise or Map)."
        }
      }
    ]
  },
  {
    id: "7-6-class-components-fullstack-capstone",
    number: "7.6",
    title: "Class Components & Full Stack Capstone",
    subtitle: "Understand legacy React class components, lifecycle methods, and celebrate comprehensive Full Stack Open Part 7 certification.",
    readTime: "12 min",
    objectives: [
      "Read and maintain legacy React class components with this.state and this.setState",
      "Understand class component lifecycle methods (componentDidMount, componentWillUnmount)",
      "Compare class components with modern hook-based functional components",
      "Review the entire Full Stack Open ecosystem from Parts 0 through 7",
      "Understand enterprise architectural choices across frontend and backend",
      "Achieve Full Stack Open Part 7 Certification"
    ],
    theoryBlocks: [
      {
        heading: "React Class Components Basics",
        text: "Before React Hooks in 2019, state and lifecycle methods were managed through ES6 classes extending React.Component.",
        codeSnippet: `class Counter extends React.Component {\n  constructor(props) {\n    super(props);\n    this.state = { count: 0 };\n  }\n  render() {\n    return (\n      <div>\n        <p>{this.state.count}</p>\n        <button onClick={() => this.setState({ count: this.state.count + 1 })}>\n          plus\n        </button>\n      </div>\n    );\n  }\n}`,
        mcq: {
          id: "q-7.6-0-v1",
          question: "How is component state updated in an ES6 React class component?",
          options: [
            { id: "A", text: "By calling this.setState({ key: newValue })", explanationIfWrong: "this.setState queues a state transition in class components." },
            { id: "B", text: "By assigning directly: this.state.count = 5;", explanationIfWrong: "Direct state mutation is prohibited in class components and does not trigger re-renders." },
            { id: "C", text: "By calling this.dispatchState()", explanationIfWrong: "The method is this.setState()." },
            { id: "D", text: "By calling React.update()", explanationIfWrong: "this.setState is the standard class method." }
          ],
          correctAnswer: "A",
          explanationNote: "In class components, state must be updated using this.setState(). Mutating this.state directly fails to inform React of the change and skips re-rendering."
        },
        retestMcq: {
          id: "q-7.6-0-v2",
          question: "Why must super(props) be called in a class component constructor?",
          options: [
            { id: "A", text: "To call the parent React.Component constructor and allow 'this.props' to be accessed inside the constructor", explanationIfWrong: "super(props) initializes the parent class constructor." },
            { id: "B", text: "To connect to the database", explanationIfWrong: "Constructors initialize in-memory component instances." },
            { id: "C", text: "To enable CSS flexbox", explanationIfWrong: "super(props) is an ES6 class inheritance requirement." },
            { id: "D", text: "To restart the browser", explanationIfWrong: "It is standard object-oriented JavaScript syntax." }
          ],
          correctAnswer: "A",
          explanationNote: "In JavaScript derived classes, super() must be called before accessing 'this'. Passing props to super(props) ensures this.props is initialized in the constructor."
        }
      },
      {
        heading: "Lifecycle Methods: componentDidMount",
        text: "Class components use lifecycle methods like componentDidMount to fetch data or attach event listeners upon initial mounting.",
        codeSnippet: `class App extends React.Component {\n  componentDidMount() {\n    axios.get('/api/notes').then(res => {\n      this.setState({ notes: res.data });\n    });\n  }\n}`,
        mcq: {
          id: "q-7.6-1-v1",
          question: "Which modern React Hook replaces the componentDidMount lifecycle method in functional components?",
          options: [
            { id: "A", text: "useEffect(() => { ... }, []) with an empty dependency array", explanationIfWrong: "An effect with an empty dependency array executes once on mount, mirroring componentDidMount." },
            { id: "B", text: "useState(0)", explanationIfWrong: "useState initializes state, not lifecycle effects." },
            { id: "C", text: "useId()", explanationIfWrong: "useId generates unique IDs for accessibility." },
            { id: "D", text: "useMemo(() => ...)", explanationIfWrong: "useMemo is for memoizing calculation values." }
          ],
          correctAnswer: "A",
          explanationNote: "useEffect with an empty dependency array [] executes exactly once after the component mounts into the DOM, equivalent to componentDidMount."
        },
        retestMcq: {
          id: "q-7.6-1-v2",
          question: "Which class lifecycle method is called right before a component is removed from the DOM (used for cleanup)?",
          options: [
            { id: "A", text: "componentWillUnmount()", explanationIfWrong: "componentWillUnmount handles cleanup before DOM removal." },
            { id: "B", text: "componentDidCatch()", explanationIfWrong: "componentDidCatch is for error boundaries." },
            { id: "C", text: "componentDidUpdate()", explanationIfWrong: "componentDidUpdate runs after renders." },
            { id: "D", text: "render()", explanationIfWrong: "render returns JSX markup." }
          ],
          correctAnswer: "A",
          explanationNote: "componentWillUnmount() runs right before an element is unmounted, equivalent to returning a cleanup function from useEffect."
        }
      },
      {
        heading: "Why Function Components Won",
        text: "Function components with Hooks eliminated complex 'this' binding bugs, reduced code verbosity by over 50%, and enabled custom hook logic sharing.",
        codeSnippet: `// Class component: 25 lines with constructor, this.state, this.handleClick.bind(this)\n// Function component with Hooks: 6 lines, cleaner, no 'this' bugs!`,
        mcq: {
          id: "q-7.6-2-v1",
          question: "Why did the React team and community transition almost entirely from class components to function components with Hooks?",
          options: [
            { id: "A", text: "Hooks eliminated confusing 'this' binding pitfalls, allowed related logic to be grouped together, and enabled custom hooks for state reuse across components", explanationIfWrong: "Hooks dramatically improved code ergonomics, readability, and logic reuse." },
            { id: "B", text: "Because class components were removed from ECMAScript", explanationIfWrong: "Classes are a standard JavaScript language feature." },
            { id: "C", text: "Because function components can only be written in Python", explanationIfWrong: "Function components are pure JavaScript." },
            { id: "D", text: "Because classes take 5 hours to compile", explanationIfWrong: "Both compile quickly; ergonomics and logic sharing were the driving factors." }
          ],
          correctAnswer: "A",
          explanationNote: "Function components with Hooks solve class pain points: no 'this' binding issues, smaller codebases, and the ability to package and reuse stateful logic in custom hooks."
        },
        retestMcq: {
          id: "q-7.6-2-v2",
          question: "What is the only remaining feature where class components are still required in React?",
          options: [
            { id: "A", text: "Error Boundaries (using componentDidCatch or getDerivedStateFromError)", explanationIfWrong: "React does not yet have a hook equivalent for Error Boundaries." },
            { id: "B", text: "Rendering buttons", explanationIfWrong: "Buttons are rendered in function components." },
            { id: "C", text: "Using CSS", explanationIfWrong: "CSS works identically in both." },
            { id: "D", text: "Handling form inputs", explanationIfWrong: "Forms are handled with hooks." }
          ],
          correctAnswer: "A",
          explanationNote: "Error Boundaries (components that catch JavaScript errors anywhere in their child component tree) still require class components (componentDidCatch)."
        }
      },
      {
        heading: "Full Stack Open Track Overview (Parts 0–7)",
        text: "Across Parts 0 through 7, you mastered web fundamentals, React fundamentals, backend servers with Express, database integration, testing, Redux, and router navigation.",
        codeSnippet: `// The Full Stack Journey:\n// Part 0: Web Apps & HTTP Fundamentals\n// Part 1: React Basics & State\n// Part 2: Server Communication & REST\n// Part 3: Node.js & Express Backends (MongoDB)\n// Part 4: Testing & User Authentication (JWT/Bcrypt)\n// Part 5: Frontend Testing & E2E (Playwright)\n// Part 6: Redux, Redux Toolkit & React Query\n// Part 7: React Router, Custom Hooks & Webpack`,
        mcq: {
          id: "q-7.6-3-v1",
          question: "Which part of the Full Stack Open curriculum introduced token-based user authentication using JSON Web Tokens (JWT)?",
          options: [
            { id: "A", text: "Part 4 (Testing Express Servers & User Administration)", explanationIfWrong: "Part 4 introduced user administration, password hashing, and JWT tokens." },
            { id: "B", text: "Part 0", explanationIfWrong: "Part 0 covered fundamental web mechanics and HTTP." },
            { id: "C", text: "Part 1", explanationIfWrong: "Part 1 introduced React components and state." },
            { id: "D", text: "Part 2", explanationIfWrong: "Part 2 focused on frontend server communication with Axios." }
          ],
          correctAnswer: "A",
          explanationNote: "Part 4 introduced backend user administration, bcrypt password hashing, and stateless token-based authentication using jsonwebtoken."
        },
        retestMcq: {
          id: "q-7.6-3-v2",
          question: "Which testing tool was used in Part 4 to test backend Express REST API endpoints without launching an external server?",
          options: [
            { id: "A", text: "Supertest", explanationIfWrong: "Supertest allows executing simulated HTTP requests directly against the Express app." },
            { id: "B", text: "Selenium", explanationIfWrong: "Selenium is a browser automation tool, not an Express endpoint testing library." },
            { id: "C", text: "PostCSS", explanationIfWrong: "PostCSS transforms CSS styles." },
            { id: "D", text: "Webpack", explanationIfWrong: "Webpack is a module bundler." }
          ],
          correctAnswer: "A",
          explanationNote: "Supertest wraps the Express app instance, enabling fast, programmatic HTTP requests to test routes, headers, and status codes."
        }
      },
      {
        heading: "Full Stack Architecture Decisions",
        text: "Senior full stack developers choose technology stacks purposefully: Node/Express for APIs, MongoDB for flexible documents, React for dynamic UIs, and automated tests for reliability.",
        codeSnippet: `// Full Stack Architecture:\n// [React Frontend (Vite/Router/Hooks)] <== (REST/JSON + JWT) ==> [Node/Express API (Auth/Validation)] <== (Mongoose) ==> [MongoDB Database]`,
        mcq: {
          id: "q-7.6-4-v1",
          question: "What role does the 'Mongoose ODM' play in this full stack architecture?",
          options: [
            { id: "A", text: "It models application data with schemas, enforces validations, handles casting, and maps JavaScript objects to MongoDB documents", explanationIfWrong: "Mongoose provides schema definitions, validation, and object modeling for MongoDB." },
            { id: "B", text: "It compiles JSX into HTML inside the browser", explanationIfWrong: "JSX compilation is handled by Babel/Vite in the frontend build." },
            { id: "C", text: "It replaces Express router middleware", explanationIfWrong: "Mongoose is a database ODM, not an HTTP router." },
            { id: "D", text: "It hashes passwords using bcrypt", explanationIfWrong: "bcrypt hashes passwords; Mongoose stores the resulting hash." }
          ],
          correctAnswer: "A",
          explanationNote: "Mongoose provides structured schema modeling, type casting, validation, and query building for MongoDB in Node.js applications."
        },
        retestMcq: {
          id: "q-7.6-4-v2",
          question: "Why is stateless token authentication well-suited for scalable cloud microservices?",
          options: [
            { id: "A", text: "Any backend server instance can verify the token's cryptographic signature independently without needing to query a shared centralized session database", explanationIfWrong: "Stateless tokens enable horizontal scaling with zero session database bottlenecks." },
            { id: "B", text: "Because tokens take up zero bytes of network bandwidth", explanationIfWrong: "Tokens add a small header payload, but eliminate server session queries." },
            { id: "C", text: "Because cloud servers cannot run databases", explanationIfWrong: "Cloud servers run databases easily; statelessness enables horizontal scaling." },
            { id: "D", text: "Because stateless tokens never expire", explanationIfWrong: "Tokens can and should have expiration limits." }
          ],
          correctAnswer: "A",
          explanationNote: "Stateless JWT authentication allows any server instance behind a load balancer to verify the user's identity using the shared secret key, enabling effortless horizontal scaling."
        }
      },
      {
        heading: "Full Stack Open Part 7 Certification",
        text: "Congratulations! Mastering Parts 0 through 7 certifies your complete competency as a modern Full Stack JavaScript / TypeScript Software Engineer.",
        codeSnippet: `// 🎓 FULL STACK OPEN CERTIFICATION ACHIEVED!\n// - Frontend: React, Redux Toolkit, React Query, React Router, Custom Hooks, Tailwind\n// - Backend: Node.js, Express, REST APIs, JWT Auth, Middleware\n// - Database: MongoDB, Mongoose ODM, Schema Relations\n// - Testing: Jest, Supertest, Vitest, React Testing Library, Playwright E2E\n// - Tooling: Webpack, Vite, Babel, ESLint, Git`,
        mcq: {
          id: "q-7.6-5-v1",
          question: "Which of the following summaries accurately reflects the complete professional skillset acquired across Parts 0–7 of Full Stack Open?",
          options: [
            { id: "A", text: "End-to-end full stack web development: modern React SPAs, state management, RESTful Node/Express servers, MongoDB database persistence, automated testing, and secure authentication", explanationIfWrong: "This comprehensive summary encompasses the full scope of the curriculum." },
            { id: "B", text: "Writing static HTML without JavaScript or databases", explanationIfWrong: "Full Stack Open is an advanced modern engineering curriculum." },
            { id: "C", text: "Managing local printer drivers in C++", explanationIfWrong: "The curriculum focuses on modern web application engineering." },
            { id: "D", text: "Manual spreadsheet data entry", explanationIfWrong: "Full Stack Open prepares students for professional software engineering roles." }
          ],
          correctAnswer: "A",
          explanationNote: "You have completed the core University of Helsinki Full Stack Open curriculum, mastering the complete modern web development stack from browser UI to database architecture."
        },
        retestMcq: {
          id: "q-7.6-5-v2",
          question: "What is the next logical step to continue advancing your skills beyond Part 7?",
          options: [
            { id: "A", text: "Explore GraphQL (Part 8), TypeScript (Part 9), React Native (Part 10), and CI/CD pipelines (Part 11)", explanationIfWrong: "These advanced modules build directly upon your full stack JavaScript foundation." },
            { id: "B", text: "Delete all your code and quit programming", explanationIfWrong: "Continuing to build projects reinforces and expands your skills." },
            { id: "C", text: "Never write automated tests again", explanationIfWrong: "Automated testing is a permanent engineering superpower." },
            { id: "D", text: "Only use computers manufactured before 1990", explanationIfWrong: "Continuing to learn modern cloud and web technologies will advance your career." }
          ],
          correctAnswer: "A",
          explanationNote: "The advanced Full Stack Open extensions (GraphQL, TypeScript, React Native, CI/CD, and Containers) provide further specialized industry mastery."
        }
      }
    ]
  }
];

// Helper functions for Level attempts, question selection, and 3-consecutive-failure progression lock
export const getLevelAttemptCountFullstackPart7 = (sectionId: string, studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_fullstack_p7_attempt_${sectionId}_${studentId}`);
    return saved ? Number(saved) : 1;
  } catch {
    return 1;
  }
};

export const setLevelAttemptCountFullstackPart7 = (sectionId: string, studentId: string, count: number): void => {
  try {
    localStorage.setItem(`dopilot_fullstack_p7_attempt_${sectionId}_${studentId}`, String(count));
  } catch {}
};

export const getActiveQuestionsForLevelFullstackPart7 = (
  section: SectionContent,
  studentId: string,
  forceRetest: boolean = false
): McqQuestion[] => {
  const attempt = forceRetest ? 2 : getLevelAttemptCountFullstackPart7(section.id, studentId);
  return section.theoryBlocks.map((block) => {
    if (attempt >= 2 && block.retestMcq) {
      return block.retestMcq;
    }
    return block.mcq!;
  });
};

export const getConsecutiveFailedLevelsFullstackPart7 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_fullstack_p7_failed_levels_streak_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const recordLevelAttemptResultFullstackPart7 = (
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
  const currentAttempt = getLevelAttemptCountFullstackPart7(sectionId, studentId);

  if (isPassed) {
    try {
      localStorage.setItem(`dopilot_fullstack_p7_failed_levels_streak_${studentId}`, '0');
      localStorage.setItem(`dopilot_fullstack_p7_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_fullstack_p7_attempt_${sectionId}_${studentId}`, '1');
      localStorage.removeItem(`dopilot_fullstack_p7_locked_${studentId}`);
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
      setLevelAttemptCountFullstackPart7(sectionId, studentId, 2);
      const streak = getConsecutiveFailedLevelsFullstackPart7(studentId);

      return {
        isPassed: false,
        attemptCount: 1,
        isSecondFailureInLevel: false,
        consecutiveFailedLevels: streak,
        isLocked: false
      };
    } else {
      const prevStreak = getConsecutiveFailedLevelsFullstackPart7(studentId);
      const newStreak = prevStreak + 1;
      const isLocked = newStreak >= 3;

      try {
        localStorage.setItem(`dopilot_fullstack_p7_failed_levels_streak_${studentId}`, String(newStreak));
        localStorage.setItem(`dopilot_fullstack_p7_consecutive_failures_${studentId}`, String(newStreak));
        if (isLocked) {
          localStorage.setItem(`dopilot_fullstack_p7_locked_${studentId}`, 'true');
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

export const resetConsecutiveFailuresFullstackPart7 = (studentId: string): void => {
  try {
    localStorage.setItem(`dopilot_fullstack_p7_consecutive_failures_${studentId}`, '0');
    localStorage.setItem(`dopilot_fullstack_p7_failed_levels_streak_${studentId}`, '0');
    localStorage.removeItem(`dopilot_fullstack_p7_locked_${studentId}`);
  } catch {}
};
