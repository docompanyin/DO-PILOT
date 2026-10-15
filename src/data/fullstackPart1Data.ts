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

export const FULLSTACK_PART_1_SECTIONS: SectionContent[] = [
  {
    id: "1-1-react-components-jsx",
    number: "1.1",
    title: "React Component Architecture & JSX Syntax",
    subtitle: "Master functional components, JSX compilation, fragment wrappers, and dynamic JavaScript expressions in UI.",
    readTime: "12 min",
    objectives: [
      "Define functional components that return JSX",
      "Understand how JSX compiles into React.createElement calls",
      "Use React Fragments (<>) to avoid redundant DOM wrappers",
      "Embed dynamic JavaScript expressions using curly braces {}",
      "Differentiate between HTML attributes and JSX props (e.g. className)",
      "Render multiple root components inside the main App tree"
    ],
    theoryBlocks: [
      {
        heading: "Functional Components in React",
        text: "A React component is a JavaScript function that returns JSX markup describing what should appear on the screen. Component names must always start with a capital letter.",
        codeSnippet: `const App = () => {\n  return <h1>Hello Full Stack!</h1>;\n};\nexport default App;`,
        terminalOutput: `<h1>Hello Full Stack!</h1>`,
        mcq: {
          id: "q-1.1-0-v1",
          question: "Why must React component function names start with an uppercase letter (e.g., App instead of app)?",
          options: [
            { id: "A", text: "React treats lowercase tags as native HTML elements and uppercase tags as custom components", explanationIfWrong: "" },
            { id: "B", text: "JavaScript syntax errors occur if function names are lowercase", explanationIfWrong: "JavaScript functions can start with lowercase letters; this rule is specific to JSX." },
            { id: "C", text: "Vite and Webpack bundlers crash on lowercase components", explanationIfWrong: "The bundler compiles JSX; it is React's JSX parser that distinguishes components by capitalization." },
            { id: "D", text: "Uppercase functions automatically execute asynchronously", explanationIfWrong: "Capitalization has no effect on synchronous vs asynchronous execution." }
          ],
          correctAnswer: "A",
          explanationNote: "In JSX, lowercased tags like <div> or <h1> are compiled as built-in HTML strings, while uppercased names like <App /> are compiled as component function references."
        },
        retestMcq: {
          id: "q-1.1-0-v2",
          question: "What happens if you define a React component as `const header = () => <h1>Title</h1>` and render `<header />`?",
          options: [
            { id: "A", text: "React renders a native HTML5 <header> tag rather than invoking your component", explanationIfWrong: "" },
            { id: "B", text: "React throws an immediate compile-time syntax error", explanationIfWrong: "It compiles validly, but renders standard HTML instead of your component." },
            { id: "C", text: "React capitalizes the function name behind the scenes automatically", explanationIfWrong: "JSX does not rename identifiers at runtime." },
            { id: "D", text: "The browser freezes due to an infinite render loop", explanationIfWrong: "No render loop occurs; it just creates an empty HTML tag." }
          ],
          correctAnswer: "A",
          explanationNote: "Because <header /> starts with lowercase, JSX compiles it to React.createElement('header') which renders the standard HTML5 element."
        }
      },
      {
        heading: "JSX Compilation to createElement",
        text: "JSX looks like HTML but is syntactic sugar compiled by Babel into React.createElement() method calls behind the scenes.",
        codeSnippet: `// JSX:\nconst element = <h1 className="title">Hello</h1>;\n\n// Compiled JS:\nconst element = React.createElement('h1', { className: 'title' }, 'Hello');`,
        terminalOutput: `Output: Virtual DOM Node { type: 'h1', props: { className: 'title', children: 'Hello' } }`,
        mcq: {
          id: "q-1.1-1-v1",
          question: "Under the hood, what does JSX code compile into before running in the browser?",
          options: [
            { id: "A", text: "React.createElement() JavaScript method calls", explanationIfWrong: "" },
            { id: "B", text: "Raw HTML strings injected directly into innerHTML", explanationIfWrong: "React uses a virtual DOM tree created by createElement, not raw innerHTML." },
            { id: "C", text: "Compiled WebAssembly binary instructions", explanationIfWrong: "JSX does not compile to WebAssembly." },
            { id: "D", text: "Server-side PHP templates", explanationIfWrong: "JSX is a client/node JavaScript language extension." }
          ],
          correctAnswer: "A",
          explanationNote: "JSX is compiled by Babel or SWC into standard React.createElement calls that construct lightweight Virtual DOM objects."
        },
        retestMcq: {
          id: "q-1.1-1-v2",
          question: "Which tool in modern toolchains (Vite/Webpack) transforms JSX tags into standard JavaScript function calls?",
          options: [
            { id: "A", text: "A transpiler such as Babel, SWC, or esbuild", explanationIfWrong: "" },
            { id: "B", text: "The browser's native CSS parsing engine", explanationIfWrong: "CSS engines parse style rules, not JavaScript/JSX." },
            { id: "C", text: "The operating system kernel", explanationIfWrong: "The OS kernel manages hardware, not web code transpilation." },
            { id: "D", text: "The SQL database driver", explanationIfWrong: "Database drivers communicate with databases." }
          ],
          correctAnswer: "A",
          explanationNote: "Transpilers like Babel, SWC, or esbuild compile JSX syntax into standard JavaScript before the browser executes it."
        }
      },
      {
        heading: "Root Element & React Fragments (<> ... </React.Fragment>)",
        text: "Every React component must return a single root element. React Fragments (`<>...</>`) allow grouping multiple children without adding extra wrapper nodes to the DOM.",
        codeSnippet: `const Page = () => (\n  <>\n    <h1>Full Stack</h1>\n    <p>University of Helsinki</p>\n  </>\n);`,
        terminalOutput: `DOM Output:\n<h1>Full Stack</h1>\n<p>University of Helsinki</p>`,
        mcq: {
          id: "q-1.1-2-v1",
          question: "Why does a React component require a single root element or a Fragment (<>...</>)?",
          options: [
            { id: "A", text: "A JavaScript function can only return a single value or expression", explanationIfWrong: "" },
            { id: "B", text: "The browser DOM forbids having multiple child elements", explanationIfWrong: "The DOM allows multiple children; this is a JavaScript return constraint." },
            { id: "C", text: "CSS styles fail to apply if multiple roots exist", explanationIfWrong: "CSS works regardless of root count." },
            { id: "D", text: "HTML5 specifications mandate a Fragment tag for all pages", explanationIfWrong: "Fragment is a React construct, not an HTML5 tag." }
          ],
          correctAnswer: "A",
          explanationNote: "Because JSX elements compile into function calls (React.createElement), a function return statement can only return one single expression."
        },
        retestMcq: {
          id: "q-1.1-2-v2",
          question: "What is the primary benefit of using a React Fragment `<> ... </>` over a regular `<div> ... </div>` wrapper?",
          options: [
            { id: "A", text: "It groups sibling elements without inserting an unnecessary wrapper node into the DOM", explanationIfWrong: "" },
            { id: "B", text: "It automatically caches and memoizes the rendered output", explanationIfWrong: "Fragments do not memoize components." },
            { id: "C", text: "It makes network requests execute twice as fast", explanationIfWrong: "Fragments have no connection to network requests." },
            { id: "D", text: "It prevents children from re-rendering when props change", explanationIfWrong: "Fragments do not stop re-renders." }
          ],
          correctAnswer: "A",
          explanationNote: "Fragments let you return multiple sibling elements without polluting the real DOM tree with extra layout-breaking <div> tags."
        }
      },
      {
        heading: "Dynamic JavaScript Expressions in JSX",
        text: "Curly braces `{}` in JSX switch from markup mode to JavaScript evaluation mode, allowing you to compute expressions, format variables, or call functions.",
        codeSnippet: `const now = new Date();\nconst a = 10, b = 20;\n\nreturn (\n  <div>\n    <p>Time: {now.toString()}</p>\n    <p>Sum: {a + b}</p>\n  </div>\n);`,
        terminalOutput: `<p>Time: Mon Oct 12 2026...</p>\n<p>Sum: 30</p>`,
        mcq: {
          id: "q-1.1-3-v1",
          question: "What do curly braces `{}` signify when used inside JSX markup?",
          options: [
            { id: "A", text: "They evaluate the enclosed JavaScript expression and render its return value", explanationIfWrong: "" },
            { id: "B", text: "They define a CSS style declaration block", explanationIfWrong: "CSS blocks use curly braces in stylesheets, but in JSX `{}` evaluates JavaScript." },
            { id: "C", text: "They escape text to prevent HTML formatting", explanationIfWrong: "Curly braces execute code, not merely escaping." },
            { id: "D", text: "They initiate a background web worker thread", explanationIfWrong: "Curly braces have no connection to web workers." }
          ],
          correctAnswer: "A",
          explanationNote: "In JSX, any valid JavaScript expression placed inside `{}` is evaluated dynamically at render time."
        },
        retestMcq: {
          id: "q-1.1-3-v2",
          question: "Which of the following values will NOT be rendered to the DOM when placed inside `{}` in JSX?",
          options: [
            { id: "A", text: "Booleans (true/false), null, and undefined", explanationIfWrong: "" },
            { id: "B", text: "Numbers like 42 or 3.14", explanationIfWrong: "Numbers are rendered as text." },
            { id: "C", text: "Strings like 'Hello'", explanationIfWrong: "Strings are rendered directly." },
            { id: "D", text: "Arrays of strings", explanationIfWrong: "Arrays of renderable items are joined and rendered." }
          ],
          correctAnswer: "A",
          explanationNote: "React intentionally does not render boolean values (true/false), null, or undefined to make conditional rendering convenient."
        }
      },
      {
        heading: "JSX Attributes & className vs class",
        text: "Because JSX is JavaScript, reserved keywords like `class` and `for` cannot be used directly. JSX uses `className` and `htmlFor` instead.",
        codeSnippet: `// Correct in JSX:\n<div className="container">\n  <label htmlFor="name-input">Name:</label>\n  <input id="name-input" />\n</div>`,
        terminalOutput: `Compiled HTML:\n<div class="container">\n  <label for="name-input">Name:</label>\n  <input id="name-input" />\n</div>`,
        mcq: {
          id: "q-1.1-4-v1",
          question: "Why does JSX use `className` instead of the traditional HTML attribute `class`?",
          options: [
            { id: "A", text: "`class` is a reserved keyword in JavaScript for defining ES6 classes", explanationIfWrong: "" },
            { id: "B", text: "`class` is not supported by the CSS styling specification", explanationIfWrong: "CSS uses .class selectors; this is a JS language constraint." },
            { id: "C", text: "`className` provides hardware-accelerated animations", explanationIfWrong: "className has nothing to do with hardware acceleration." },
            { id: "D", text: "HTML5 deprecated the class attribute entirely", explanationIfWrong: "HTML5 still uses class." }
          ],
          correctAnswer: "A",
          explanationNote: "Because JSX is parsed as JavaScript, reserved words like `class` must be written as `className` to prevent syntax collisions."
        },
        retestMcq: {
          id: "q-1.1-4-v2",
          question: "What is the correct JSX replacement for the HTML `<label for='email'>` attribute?",
          options: [
            { id: "A", text: "`<label htmlFor='email'>`", explanationIfWrong: "" },
            { id: "B", text: "`<label target='email'>`", explanationIfWrong: "target is used for links (<a target='_blank'>)." },
            { id: "C", text: "`<label inputFor='email'>`", explanationIfWrong: "inputFor is not a valid React prop." },
            { id: "D", text: "`<label bind='email'>`", explanationIfWrong: "bind is used in other frameworks, not React JSX." }
          ],
          correctAnswer: "A",
          explanationNote: "In JSX, the HTML `for` attribute is written as `htmlFor` because `for` is a reserved JavaScript keyword for loops."
        }
      },
      {
        heading: "Component Composition & Modularity",
        text: "Applications are constructed by assembling small, reusable components together into a tree structure, where the App component acts as the root.",
        codeSnippet: `const Header = () => <h1>Helsinki Part 1</h1>;\nconst Content = () => <p>Learning React fundamentals.</p>;\n\nconst App = () => (\n  <div>\n    <Header />\n    <Content />\n  </div>\n);`,
        terminalOutput: `Rendered Page:\n<h1>Helsinki Part 1</h1>\n<p>Learning React fundamentals.</p>`,
        mcq: {
          id: "q-1.1-5-v1",
          question: "What architectural principle does React encourage by combining multiple functional components into an App?",
          options: [
            { id: "A", text: "Component composition and separation of concerns", explanationIfWrong: "" },
            { id: "B", text: "Monolithic global scope programming", explanationIfWrong: "React promotes modularity rather than monolithic design." },
            { id: "C", text: "Direct imperative DOM manipulation", explanationIfWrong: "React uses declarative virtual DOM components, not imperative code." },
            { id: "D", text: "Synchronous database queries in UI templates", explanationIfWrong: "Databases are queried asynchronously via APIs." }
          ],
          correctAnswer: "A",
          explanationNote: "React's primary design strength is component composition: building complex UIs by nesting focused, reusable, isolated functions."
        },
        retestMcq: {
          id: "q-1.1-5-v2",
          question: "What is the relationship between the `<App />` component and subcomponents like `<Header />` and `<Content />`?",
          options: [
            { id: "A", text: "App is the parent component that renders Header and Content as child components", explanationIfWrong: "" },
            { id: "B", text: "Header and Content inherit from App using classical object inheritance", explanationIfWrong: "React uses composition, not class inheritance." },
            { id: "C", text: "Header and Content run on separate background browser threads", explanationIfWrong: "React components execute on the main UI thread." },
            { id: "D", text: "App can only render subcomponents after a page reload", explanationIfWrong: "Subcomponents render immediately when App renders." }
          ],
          correctAnswer: "A",
          explanationNote: "In React's declarative hierarchy, App acts as a parent component that composes and renders child components."
        }
      }
    ]
  },
  {
    id: "1-2-props-component-data",
    number: "1.2",
    title: "Props & Unidirectional Data Flow",
    subtitle: "Pass dynamic parameters to components, destructure properties, handle complex objects, and maintain immutable data flow.",
    readTime: "14 min",
    objectives: [
      "Pass primitive and object props to child components",
      "Destructure props in component argument signatures",
      "Understand unidirectional data flow (parent to child)",
      "Enforce props immutability (read-only nature)",
      "Provide default prop fallbacks and handle missing data",
      "Render dynamic lists by passing data items via props"
    ],
    theoryBlocks: [
      {
        heading: "Passing Data via Props",
        text: "Props (short for properties) allow a parent component to pass data downward to child components like function arguments.",
        codeSnippet: `const Hello = (props) => {\n  return <p>Hello {props.name}, age {props.age}</p>;\n};\n\n// Usage in Parent:\n<Hello name="Maya" age={26} />`,
        terminalOutput: `<p>Hello Maya, age 26</p>`,
        mcq: {
          id: "q-1.2-0-v1",
          question: "How do props pass data between React components?",
          options: [
            { id: "A", text: "Unidirectionally downward from parent to child components", explanationIfWrong: "" },
            { id: "B", text: "Bidirectionally with automatic synchronization in both directions", explanationIfWrong: "React enforces one-way data flow; children cannot mutate parent props directly." },
            { id: "C", text: "Globally between any two sibling components without parents", explanationIfWrong: "Props cannot jump directly between siblings without a common parent." },
            { id: "D", text: "From child to parent via return statements", explanationIfWrong: "Components return JSX markup, not props back to parents." }
          ],
          correctAnswer: "A",
          explanationNote: "React enforces a strict unidirectional data flow: data moves from top to bottom (parents pass props down to children)."
        },
        retestMcq: {
          id: "q-1.2-0-v2",
          question: "When passing a numeric value like 25 as a prop in JSX, what syntax must be used?",
          options: [
            { id: "A", text: "`age={25}` with curly braces", explanationIfWrong: "" },
            { id: "B", text: "`age='25'` with quotes", explanationIfWrong: "Quotes pass the value as a string '25', not a number." },
            { id: "C", text: "`age=(25)` with parentheses", explanationIfWrong: "Parentheses alone are invalid JSX prop syntax." },
            { id: "D", text: "`age: 25` with a colon", explanationIfWrong: "Colons are for JS object literals, not JSX attributes." }
          ],
          correctAnswer: "A",
          explanationNote: "In JSX, non-string values such as numbers, booleans, arrays, or objects must be enclosed in curly braces `{25}`."
        }
      },
      {
        heading: "Destructuring Props in Arguments",
        text: "Destructuring allows unpacking specific properties directly in the function parameter signature for cleaner, more readable code.",
        codeSnippet: `// Instead of props.name and props.age:\nconst Hello = ({ name, age }) => {\n  return <p>Hello {name}, you are {age} years old.</p>;\n};`,
        terminalOutput: `<p>Hello Maya, you are 26 years old.</p>`,
        mcq: {
          id: "q-1.2-1-v1",
          question: "What is the advantage of writing `const Hello = ({ name, age }) =>` instead of `const Hello = (props) =>`?",
          options: [
            { id: "A", text: "It unpacks properties directly, avoiding repetitive `props.` prefixing", explanationIfWrong: "" },
            { id: "B", text: "It prevents the component from ever re-rendering", explanationIfWrong: "Destructuring syntax does not affect re-rendering behavior." },
            { id: "C", text: "It automatically validates prop types with TypeScript at runtime", explanationIfWrong: "JavaScript destructuring does not perform runtime type checking." },
            { id: "D", text: "It allocates less heap memory in the browser engine", explanationIfWrong: "Memory allocation is functionally equivalent." }
          ],
          correctAnswer: "A",
          explanationNote: "ES6 parameter destructuring unpacks values directly from the props object into local variables, making component code concise."
        },
        retestMcq: {
          id: "q-1.2-1-v2",
          question: "How can you provide a default fallback value for a prop using parameter destructuring?",
          options: [
            { id: "A", text: "const User = ({ name = 'Guest' }) => <h1>{name}</h1>", explanationIfWrong: "" },
            { id: "B", text: "const User = ({ name || 'Guest' }) => <h1>{name}</h1>", explanationIfWrong: "Logical OR is an expression, invalid in parameter patterns." },
            { id: "C", text: "const User = ({ name: default 'Guest' }) => <h1>{name}</h1>", explanationIfWrong: "Syntax error in JavaScript parameter lists." },
            { id: "D", text: "const User = ({ name ?? 'Guest' }) => <h1>{name}</h1>", explanationIfWrong: "Nullish coalescing is an expression, not a parameter default syntax." }
          ],
          correctAnswer: "A",
          explanationNote: "JavaScript ES6 destructuring allows assigning default values using `=` inside the parameter pattern: `{ name = 'Guest' }`."
        }
      },
      {
        heading: "Immutability of Props",
        text: "Props are strictly read-only. A component must never modify its received props directly; only the parent component can provide new prop values.",
        codeSnippet: `const Counter = (props) => {\n  // ❌ NEVER DO THIS:\n  // props.count = props.count + 1;\n  return <span>{props.count}</span>;\n};`,
        terminalOutput: `Error if mutated: TypeError: Cannot assign to read only property 'count'`,
        mcq: {
          id: "q-1.2-2-v1",
          question: "What happens if a child component tries to mutate its own props (e.g., `props.total = 100`)?",
          options: [
            { id: "A", text: "It violates React's pure function rule and causes runtime errors in strict mode", explanationIfWrong: "" },
            { id: "B", text: "The parent component automatically updates its state", explanationIfWrong: "Props mutation does not update parent state; it breaks React's model." },
            { id: "C", text: "React creates a clone of the entire DOM tree", explanationIfWrong: "React does not clone the DOM tree on prop mutation." },
            { id: "D", text: "The variable is saved to localStorage automatically", explanationIfWrong: "Props are never saved to localStorage automatically." }
          ],
          correctAnswer: "A",
          explanationNote: "React components must behave as pure functions with respect to their props. Modifying props directly breaks React's unidirectional flow."
        },
        retestMcq: {
          id: "q-1.2-2-v2",
          question: "If a child component needs to change a value received as a prop, what is the correct architectural pattern?",
          options: [
            { id: "A", text: "The parent passes a callback function prop that the child calls to request a change", explanationIfWrong: "" },
            { id: "B", text: "The child directly overwrites the parent's memory reference", explanationIfWrong: "Direct memory overwriting is impossible in React's component model." },
            { id: "C", text: "The child modifies document.body directly", explanationIfWrong: "Manipulating DOM directly circumvents React." },
            { id: "D", text: "The child reloads the entire browser tab", explanationIfWrong: "Full tab reloads defeat single-page application principles." }
          ],
          correctAnswer: "A",
          explanationNote: "In React, when a child needs to communicate a change to a parent, the parent passes down an event callback function as a prop."
        }
      },
      {
        heading: "Passing Objects as Props",
        text: "Components can accept complex objects as props. You can pass the entire object or specific nested properties down to child components.",
        codeSnippet: `const course = {\n  name: 'Half Stack application development',\n  parts: 3\n};\n\nconst Header = ({ course }) => <h1>{course.name} ({course.parts} parts)</h1>;\n<Header course={course} />`,
        terminalOutput: `<h1>Half Stack application development (3 parts)</h1>`,
        mcq: {
          id: "q-1.2-3-v1",
          question: "When passing an object `item = { title: 'React', hours: 40 }` to a component `<Course />`, what is the correct syntax?",
          options: [
            { id: "A", text: "`<Course info={item} />`", explanationIfWrong: "" },
            { id: "B", text: "`<Course info='item' />`", explanationIfWrong: "This passes the literal string 'item', not the object." },
            { id: "C", text: "`<Course item>`", explanationIfWrong: "Passing an attribute without a value defaults to boolean true." },
            { id: "D", text: "`<Course [item] />`", explanationIfWrong: "Brackets [] outside curly braces are invalid JSX syntax." }
          ],
          correctAnswer: "A",
          explanationNote: "Passing an object requires curly braces in JSX: `<Course info={item} />` assigns the object reference to the `info` prop."
        },
        retestMcq: {
          id: "q-1.2-3-v2",
          question: "Given `<User profile={{ name: 'Alex', role: 'Admin' }} />`, why are there double curly braces `{{ }}`?",
          options: [
            { id: "A", text: "The outer braces enter JSX JavaScript mode, and the inner braces create an object literal", explanationIfWrong: "" },
            { id: "B", text: "Double braces denote an asynchronous prop", explanationIfWrong: "Braces have no relationship with asynchronous execution." },
            { id: "C", text: "React requires double braces for all string values", explanationIfWrong: "Strings can be passed in simple quotes: prop='value'." },
            { id: "D", text: "Double braces encrypt the object before rendering", explanationIfWrong: "JSX does not perform encryption." }
          ],
          correctAnswer: "A",
          explanationNote: "The outer `{}` tells JSX that JavaScript follows; the inner `{}` defines an in-place JavaScript object literal."
        }
      },
      {
        heading: "Rendering Multiple Props & Computations",
        text: "Components can receive multiple props, compute derived values inside the component body, and render the calculated result cleanly.",
        codeSnippet: `const Total = ({ part1, part2, part3 }) => {\n  const sum = part1.exercises + part2.exercises + part3.exercises;\n  return <p>Number of exercises: {sum}</p>;\n};`,
        terminalOutput: `<p>Number of exercises: 31</p>`,
        mcq: {
          id: "q-1.2-4-v1",
          question: "Where should temporary calculations based strictly on props be computed inside a functional component?",
          options: [
            { id: "A", text: "Directly in the function body before returning the JSX markup", explanationIfWrong: "" },
            { id: "B", text: "In a global window variable outside the file", explanationIfWrong: "Global window variables cause cross-component race conditions." },
            { id: "C", text: "Inside the component's HTML <head> element", explanationIfWrong: "React components do not write to <head> for local logic." },
            { id: "D", text: "In the browser's cookies", explanationIfWrong: "Cookies are for HTTP headers and auth persistence, not UI calculations." }
          ],
          correctAnswer: "A",
          explanationNote: "Derived values calculated from props belong directly in the component function body before the return statement."
        },
        retestMcq: {
          id: "q-1.2-4-v2",
          question: "If a component receives `exercises = [10, 7, 14]`, how can it compute the total exercises cleanly in modern JS?",
          options: [
            { id: "A", text: "const total = exercises.reduce((sum, current) => sum + current, 0)", explanationIfWrong: "" },
            { id: "B", text: "const total = exercises.filter(x => x + 1)", explanationIfWrong: "filter filters elements by truthiness; it does not sum them." },
            { id: "C", text: "const total = exercises.slice(0, 3)", explanationIfWrong: "slice copies a portion of an array without calculating sums." },
            { id: "D", text: "const total = exercises.push(sum)", explanationIfWrong: "push mutates the array and returns the new length." }
          ],
          correctAnswer: "A",
          explanationNote: "`Array.prototype.reduce()` cleanly accumulates array values into a single numerical result without external state."
        }
      },
      {
        heading: "Props vs State Preview",
        text: "Props are passed into a component from the outside and cannot be changed by the component. State is managed internally and can change over time.",
        codeSnippet: `// Props: Passed from parent (immutable)\nconst Display = ({ counter }) => <div>{counter}</div>;\n\n// State: Managed inside component (mutable via setter)\n// const [counter, setCounter] = useState(0);`,
        terminalOutput: `Props = external & fixed | State = internal & dynamic`,
        mcq: {
          id: "q-1.2-5-v1",
          question: "What is the key difference between props and state in React?",
          options: [
            { id: "A", text: "Props are passed from parent to child (read-only), while state is managed locally inside a component (can change)", explanationIfWrong: "" },
            { id: "B", text: "Props are stored in the database, while state is stored in CSS", explanationIfWrong: "Neither is stored in databases or CSS." },
            { id: "C", text: "Props can only be strings, while state can only be numbers", explanationIfWrong: "Both props and state can hold any JavaScript data type." },
            { id: "D", text: "Props cause page refreshes, while state does not", explanationIfWrong: "Neither causes a page refresh in React." }
          ],
          correctAnswer: "A",
          explanationNote: "Props configure a component from the outside (like function parameters); state represents local, interactive data that changes over time."
        },
        retestMcq: {
          id: "q-1.2-5-v2",
          question: "Can a parent component's state be passed down to a child component as a prop?",
          options: [
            { id: "A", text: "Yes, a parent's state value can be passed down as a prop to any child component", explanationIfWrong: "" },
            { id: "B", text: "No, React forbids passing state variables into JSX attributes", explanationIfWrong: "Passing state as props is one of React's core patterns." },
            { id: "C", text: "Only if the child component is written in TypeScript", explanationIfWrong: "This applies to standard JavaScript React." },
            { id: "D", text: "Only if the parent and child are declared in the same file", explanationIfWrong: "Components can be imported from different files freely." }
          ],
          correctAnswer: "A",
          explanationNote: "A parent's state variable is passed to a child as a prop `<Display counter={counter} />`. When parent state changes, the child receives updated props."
        }
      }
    ]
  },
  {
    id: "1-3-modern-js-for-react",
    number: "1.3",
    title: "Modern JavaScript (ES6+) for React",
    subtitle: "Master const vs let, arrow functions, array functional methods (.map, .filter), template literals, and object spread syntax.",
    readTime: "15 min",
    objectives: [
      "Distinguish between const, let, and deprecated var",
      "Write concise arrow functions with implicit and explicit returns",
      "Transform arrays into UI elements using .map()",
      "Filter collections using .filter() without mutating original data",
      "Copy and update object structures using the spread operator (...)",
      "Use template literals for dynamic string interpolation"
    ],
    theoryBlocks: [
      {
        heading: "Variable Declarations: const vs let",
        text: "Always use `const` by default for variables that won't be reassigned. Use `let` only when you must reassign a variable. Never use `var` in modern React code.",
        codeSnippet: `const course = 'Full Stack Open';\n// course = 'Other'; // ❌ TypeError: Assignment to constant variable\n\nlet counter = 0;\ncounter += 1; // ✅ Allowed`,
        terminalOutput: `counter = 1`,
        mcq: {
          id: "q-1.3-0-v1",
          question: "Why should `var` be avoided in modern React applications?",
          options: [
            { id: "A", text: "`var` has function scope rather than block scope, leading to unexpected hoisting and mutation bugs", explanationIfWrong: "" },
            { id: "B", text: "`var` was removed from the ECMAScript standard in 2020", explanationIfWrong: "var remains in JavaScript for backwards compatibility." },
            { id: "C", text: "React bundlers reject files containing the word `var`", explanationIfWrong: "Bundlers do not reject var; it is a code quality best practice." },
            { id: "D", text: "`var` variables can only hold string values", explanationIfWrong: "var can hold any JavaScript data type." }
          ],
          correctAnswer: "A",
          explanationNote: "`const` and `let` provide strict block scoping `{}` and prevent accidental variable re-declaration and hoisting pitfalls caused by `var`."
        },
        retestMcq: {
          id: "q-1.3-0-v2",
          question: "Can the contents of an array or object declared with `const` be mutated?",
          options: [
            { id: "A", text: "Yes, `const` prevents reassigning the variable identifier, but does not make the object deeply frozen", explanationIfWrong: "" },
            { id: "B", text: "No, `const` automatically freezes all properties and array elements", explanationIfWrong: "const only freezes the reference variable, not the object's contents." },
            { id: "C", text: "Only if Object.preventExtensions is called", explanationIfWrong: "Object.preventExtensions is separate from const." },
            { id: "D", text: "Only in non-strict JavaScript mode", explanationIfWrong: "const behavior is consistent in strict mode." }
          ],
          correctAnswer: "A",
          explanationNote: "`const` creates an immutable binding to a memory reference, but objects and arrays themselves can still be mutated unless frozen with `Object.freeze()`."
        }
      },
      {
        heading: "Arrow Functions & Concise Syntax",
        text: "Arrow functions provide a clean syntax for defining functions. If the body is a single expression, curly braces and the `return` keyword can be omitted.",
        codeSnippet: `// Explicit return:\nconst sum = (p1, p2) => {\n  return p1 + p2;\n};\n\n// Implicit return:\nconst square = p => p * p;`,
        terminalOutput: `sum(2, 3) = 5\nsquare(4) = 16`,
        mcq: {
          id: "q-1.3-1-v1",
          question: "What is an implicit return in a JavaScript arrow function?",
          options: [
            { id: "A", text: "Returning an expression directly without writing `{ return ... }`", explanationIfWrong: "" },
            { id: "B", text: "A function that always returns undefined", explanationIfWrong: "An empty function returns undefined; implicit return returns an evaluated expression." },
            { id: "C", text: "A function that returns values directly to the browser console", explanationIfWrong: "Console output is side-effect logging, not a return value." },
            { id: "D", text: "A function called without parentheses", explanationIfWrong: "Function invocation requires parentheses." }
          ],
          correctAnswer: "A",
          explanationNote: "When arrow function bodies omit curly braces `() => expression`, the result of the expression is returned implicitly."
        },
        retestMcq: {
          id: "q-1.3-1-v2",
          question: "How do you implicitly return an object literal from an arrow function?",
          options: [
            { id: "A", text: "Wrap the object in parentheses: `() => ({ id: 1, name: 'React' })`", explanationIfWrong: "" },
            { id: "B", text: "Use double curly braces: `() => {{ id: 1, name: 'React' }}`", explanationIfWrong: "The engine interprets outer braces as a function body, causing a syntax error." },
            { id: "C", text: "Write `() => object { id: 1 }`", explanationIfWrong: "There is no 'object' keyword in JavaScript for literals." },
            { id: "D", text: "Write `() => [id: 1, name: 'React']`", explanationIfWrong: "Brackets create an array, not an object." }
          ],
          correctAnswer: "A",
          explanationNote: "Wrapping an object in parentheses `({ ... })` tells the JavaScript parser that the curly braces belong to an object literal, not a function block."
        }
      },
      {
        heading: "Array Transformation with .map()",
        text: "The `.map()` method creates a brand-new array by applying a transformation callback to each item in the original array without mutating it.",
        codeSnippet: `const numbers = [1, 2, 3];\nconst doubled = numbers.map(n => n * 2); // [2, 4, 6]\n\n// In React:\nconst items = ['React', 'Node', 'Vite'];\nconst list = items.map(tech => <li key={tech}>{tech}</li>);`,
        terminalOutput: `Result: [<li>React</li>, <li>Node</li>, <li>Vite</li>]`,
        mcq: {
          id: "q-1.3-2-v1",
          question: "Why is `.map()` the preferred method for rendering dynamic lists of elements in React?",
          options: [
            { id: "A", text: "It returns a new array of JSX elements without mutating the original source array", explanationIfWrong: "" },
            { id: "B", text: "It runs asynchronously in background web workers", explanationIfWrong: ".map() runs synchronously on the main thread." },
            { id: "C", text: "It eliminates the need for unique keys on list items", explanationIfWrong: "React still requires unique key props for mapped elements." },
            { id: "D", text: "It automatically filters out null and undefined values", explanationIfWrong: ".map() transforms all items without filtering." }
          ],
          correctAnswer: "A",
          explanationNote: "React favors immutability and declarative coding. `.map()` generates an array of JSX elements cleanly without side effects or mutations."
        },
        retestMcq: {
          id: "q-1.3-2-v2",
          question: "What is the difference between `numbers.map()` and `numbers.forEach()`?",
          options: [
            { id: "A", text: "`.map()` returns a new transformed array, while `.forEach()` returns undefined and is used for side-effects", explanationIfWrong: "" },
            { id: "B", text: "`.forEach()` cannot accept arrow functions", explanationIfWrong: ".forEach() accepts arrow functions without issue." },
            { id: "C", text: "`.map()` mutates the source array directly in memory", explanationIfWrong: ".map() does not mutate the source array." },
            { id: "D", text: "`.forEach()` is only supported in Node.js, not browsers", explanationIfWrong: "Both methods are standard ECMAScript available in all environments." }
          ],
          correctAnswer: "A",
          explanationNote: "`.map()` constructs and returns a new transformed array, making it ideal for rendering JSX. `.forEach()` returns `undefined`."
        }
      },
      {
        heading: "Non-Mutating Array Filtering with .filter()",
        text: "The `.filter()` method returns a new array containing only elements that satisfy a boolean condition, preserving the original array intact.",
        codeSnippet: `const scores = [15, 82, 94, 45, 88];\nconst passingScores = scores.filter(score => score >= 80);\n// passingScores = [82, 94, 88]`,
        terminalOutput: `Original: [15, 82, 94, 45, 88] | Filtered: [82, 94, 88]`,
        mcq: {
          id: "q-1.3-3-v1",
          question: "What does the `.filter()` array method return?",
          options: [
            { id: "A", text: "A new array containing only the elements for which the callback returned true", explanationIfWrong: "" },
            { id: "B", text: "A single boolean indicating if any element matched", explanationIfWrong: "Array.prototype.some() returns a boolean, not .filter()." },
            { id: "C", text: "The index of the first matching element", explanationIfWrong: "Array.prototype.findIndex() returns an index." },
            { id: "D", text: "The original array with matching elements removed in-place", explanationIfWrong: ".filter() does not mutate the original array in-place." }
          ],
          correctAnswer: "A",
          explanationNote: "`.filter()` produces a shallow copy of the portion of the array that passes the test implemented by the provided callback function."
        },
        retestMcq: {
          id: "q-1.3-3-v2",
          question: "How can you remove an item with `id === 3` from an array `notes` without mutating the state array in React?",
          options: [
            { id: "A", text: "`notes.filter(note => note.id !== 3)`", explanationIfWrong: "" },
            { id: "B", text: "`notes.delete(3)`", explanationIfWrong: "Arrays do not have a .delete() method." },
            { id: "C", text: "`notes.splice(3, 1)`", explanationIfWrong: "splice() mutates the original array in-place, which is bad for React state." },
            { id: "D", text: "`notes.pop(3)`", explanationIfWrong: "pop() takes no arguments and removes only the last element in-place." }
          ],
          correctAnswer: "A",
          explanationNote: "Using `notes.filter(note => note.id !== 3)` returns a brand-new array excluding the target item without mutating state."
        }
      },
      {
        heading: "Object Spread Operator (`...`)",
        text: "The spread operator (`...`) creates shallow copies of objects or arrays, allowing you to update specific fields while keeping everything else immutable.",
        codeSnippet: `const user = { name: 'Dan', age: 30, city: 'Helsinki' };\n\n// Create updated copy without mutating original:\nconst updatedUser = { ...user, age: 31 };\n// user.age is still 30; updatedUser.age is 31`,
        terminalOutput: `{ name: 'Dan', age: 31, city: 'Helsinki' }`,
        mcq: {
          id: "q-1.3-4-v1",
          question: "In the expression `const updated = { ...state, counter: state.counter + 1 }`, what does `...state` do?",
          options: [
            { id: "A", text: "It copies all existing key-value pairs from `state` into the new object", explanationIfWrong: "" },
            { id: "B", text: "It deletes the state object from computer memory", explanationIfWrong: "Spread does not delete memory." },
            { id: "C", text: "It compares state with updated to detect differences", explanationIfWrong: "Spread copies properties; it does not diff them." },
            { id: "D", text: "It converts the state object into a JSON string", explanationIfWrong: "JSON.stringify converts objects to strings, not the spread operator." }
          ],
          correctAnswer: "A",
          explanationNote: "The object spread operator (`...`) unpacks all enumerable own properties of an existing object into a fresh target object."
        },
        retestMcq: {
          id: "q-1.3-4-v2",
          question: "If an object has `{ a: 1, b: 2 }` and you do `{ ...obj, a: 99 }`, what will the property `a` equal?",
          options: [
            { id: "A", text: "99, because later properties overwrite earlier properties with the same key", explanationIfWrong: "" },
            { id: "B", text: "1, because the original object cannot be overridden", explanationIfWrong: "In object literals, later definitions override earlier ones." },
            { id: "C", text: "An array [1, 99]", explanationIfWrong: "Objects do not combine duplicate keys into arrays." },
            { id: "D", text: "A syntax error will be thrown", explanationIfWrong: "Overwriting keys via spread is completely valid in JavaScript." }
          ],
          correctAnswer: "A",
          explanationNote: "Properties placed after the spread operator override any matching keys that came from the spread object."
        }
      },
      {
        heading: "Template Literals & String Interpolation",
        text: "Template literals use backticks (`` ` ``) and `${}` placeholders to embed expressions, variables, and multi-line strings without clunky `+` concatenation.",
        codeSnippet: `const name = 'Matti';\nconst parts = 14;\n\n// Instead of 'Instructor: ' + name + ' teaches ' + parts + ' parts'\nconst message = \`Instructor: \${name} teaches \${parts} parts\`;`,
        terminalOutput: `Instructor: Matti teaches 14 parts`,
        mcq: {
          id: "q-1.3-5-v1",
          question: "Which characters define a JavaScript template literal?",
          options: [
            { id: "A", text: "Backticks `` ` ... ` ``", explanationIfWrong: "" },
            { id: "B", text: "Single quotes `' ... '`", explanationIfWrong: "Single quotes create standard string literals without interpolation." },
            { id: "C", text: "Double quotes `\" ... \"`", explanationIfWrong: "Double quotes create standard string literals without interpolation." },
            { id: "D", text: "Parentheses `( ... )`", explanationIfWrong: "Parentheses denote expressions or parameters." }
          ],
          correctAnswer: "A",
          explanationNote: "Template literals are delimited with backtick characters (`` ` ``), allowing multi-line strings and interpolation with `${}`."
        },
        retestMcq: {
          id: "q-1.3-5-v2",
          question: "What does the `${}` syntax allow inside backtick template literals?",
          options: [
            { id: "A", text: "Evaluating any arbitrary JavaScript expression and converting its result to string", explanationIfWrong: "" },
            { id: "B", text: "Defining inline CSS styles", explanationIfWrong: "CSS styles are not defined by ${}." },
            { id: "C", text: "Triggering a browser prompt dialog", explanationIfWrong: "Prompt dialogs are triggered by window.prompt()." },
            { id: "D", text: "Importing external npm packages", explanationIfWrong: "npm packages are imported via import statements." }
          ],
          correctAnswer: "A",
          explanationNote: "Inside template literals, `${}` evaluates variables, calculations, or function calls and interpolates the result into the string."
        }
      }
    ]
  },
  {
    id: "1-4-state-with-usestate",
    number: "1.4",
    title: "Component State with useState",
    subtitle: "Understand stateful components, the useState hook, re-rendering triggers, state immutability, and asynchronous state updates.",
    readTime: "15 min",
    objectives: [
      "Import and initialize state using the useState hook",
      "Understand array destructuring of [state, setState]",
      "Trigger component re-renders by calling state updater functions",
      "Treat state as immutable (never modify state directly)",
      "Understand asynchronous batched state updates",
      "Use functional updater callbacks when state depends on previous state"
    ],
    theoryBlocks: [
      {
        heading: "Stateful Components & useState Hook",
        text: "The `useState` hook adds reactive memory to a functional component. When state updates via its setter function, React automatically re-renders the component to show new UI.",
        codeSnippet: `import { useState } from 'react';\n\nconst Counter = () => {\n  const [counter, setCounter] = useState(0);\n  return <div>Count: {counter}</div>;\n};`,
        terminalOutput: `Count: 0 (re-renders automatically whenever setCounter is called)`,
        mcq: {
          id: "q-1.4-0-v1",
          question: "What does calling `useState(initialValue)` return in a React component?",
          options: [
            { id: "A", text: "An array with exactly two elements: the current state value and a state updater function", explanationIfWrong: "" },
            { id: "B", text: "A single boolean indicating if the component is mounted", explanationIfWrong: "useState provides state storage, not a mount boolean." },
            { id: "C", text: "The raw DOM element corresponding to the component", explanationIfWrong: "React does not return raw DOM nodes from useState." },
            { id: "D", text: "A Promise that resolves after the first click", explanationIfWrong: "useState is a synchronous hook." }
          ],
          correctAnswer: "A",
          explanationNote: "`useState` returns a pair: `[currentValue, setterFunction]`. By convention, developers destructure this as `[value, setValue]`."
        },
        retestMcq: {
          id: "q-1.4-0-v2",
          question: "What triggers a React functional component to re-render and re-execute its function body?",
          options: [
            { id: "A", text: "A change in component state (via its setter function) or updated props from its parent", explanationIfWrong: "" },
            { id: "B", text: "Moving the mouse cursor over the browser viewport", explanationIfWrong: "Mouse movements do not cause re-renders unless attached to state." },
            { id: "C", text: "Any change in local non-state variables declared with `let`", explanationIfWrong: "Modifying normal variables does not notify React or trigger re-renders." },
            { id: "D", text: "A periodic 1-second background interval by default", explanationIfWrong: "React only re-renders when state, props, or context changes." }
          ],
          correctAnswer: "A",
          explanationNote: "React's reactivity is driven by state, props, and context changes. Calling a state setter schedules a re-render."
        }
      },
      {
        heading: "Never Mutate State Directly",
        text: "State in React is read-only. Modifying a state variable directly (`counter = counter + 1`) fails to notify React and will not trigger a UI update.",
        codeSnippet: `// ❌ WRONG: React has no idea this happened, UI won't update\n// counter = counter + 1;\n\n// ✅ CORRECT: Notifies React and schedules a clean re-render\nsetCounter(counter + 1);`,
        terminalOutput: `State updated -> React schedules re-render with new virtual DOM`,
        mcq: {
          id: "q-1.4-1-v1",
          question: "Why does writing `counter = counter + 1` fail to update the displayed count on the screen?",
          options: [
            { id: "A", text: "Direct mutation does not trigger React's reconciliation engine or schedule a re-render", explanationIfWrong: "" },
            { id: "B", text: "JavaScript forbids assigning numbers to existing variables", explanationIfWrong: "JavaScript allows variable re-assignment; React is unaware of it." },
            { id: "C", text: "The browser halts execution for security violations", explanationIfWrong: "No security violation occurs; it is simply a lost update in React." },
            { id: "D", text: "CSS disables rendering whenever equality operators are used", explanationIfWrong: "CSS styling has no impact on JS assignments." }
          ],
          correctAnswer: "A",
          explanationNote: "React monitors changes through setter functions like `setCounter`. Directly assigning a value bypasses React's render loop."
        },
        retestMcq: {
          id: "q-1.4-1-v2",
          question: "If you have an array in state `const [items, setItems] = useState(['A', 'B'])`, what is the correct way to add item 'C'?",
          options: [
            { id: "A", text: "`setItems(items.concat('C'))` or `setItems([...items, 'C'])`", explanationIfWrong: "" },
            { id: "B", text: "`items.push('C')` followed by nothing", explanationIfWrong: "push() mutates the array in-place, which violates immutability and won't trigger re-render." },
            { id: "C", text: "`items = items + 'C'`", explanationIfWrong: "This converts the array to an unexpected string." },
            { id: "D", text: "`setItems(items.push('C'))`", explanationIfWrong: "push() returns the new array length (a number), destroying state." }
          ],
          correctAnswer: "A",
          explanationNote: "Both `.concat()` and spread syntax `[...items, 'C']` create a brand-new array without mutating the existing state in-place."
        }
      },
      {
        heading: "Functional State Updaters (`prev => prev + 1`)",
        text: "When new state depends on the previous state, pass an updater function (`prev => prev + 1`) to guarantee working with the latest state value.",
        codeSnippet: `// If updating multiple times in quick succession:\nsetCounter(prevCount => prevCount + 1);\nsetCounter(prevCount => prevCount + 1); // Safely increments by 2`,
        terminalOutput: `Safely updates from 0 -> 1 -> 2 even in batched asynchronous runs`,
        mcq: {
          id: "q-1.4-2-v1",
          question: "When should you use the functional updater syntax `setValue(prev => prev + 1)` instead of `setValue(value + 1)`?",
          options: [
            { id: "A", text: "Whenever the next state depends directly on the previous state value", explanationIfWrong: "" },
            { id: "B", text: "Only when setting state from a server HTTP response", explanationIfWrong: "Functional updates are useful across all event handlers." },
            { id: "C", text: "Only when the state is a boolean", explanationIfWrong: "Functional updates work with any data type (numbers, objects, arrays)." },
            { id: "D", text: "Whenever you want to prevent components from re-rendering", explanationIfWrong: "Functional updaters still schedule re-renders." }
          ],
          correctAnswer: "A",
          explanationNote: "Because state updates are batched and asynchronous, passing a callback `prev => prev + 1` guarantees access to the freshest queued state value."
        },
        retestMcq: {
          id: "q-1.4-2-v2",
          question: "If you call `setCount(count + 1)` three times synchronously in the same event handler starting at 0, what will count be on the next render?",
          options: [
            { id: "A", text: "1, because all three calls referenced the same stale closure snapshot of count (0)", explanationIfWrong: "" },
            { id: "B", text: "3, because React re-renders three separate times sequentially", explanationIfWrong: "React batches updates and executes them together." },
            { id: "C", text: "0, because the calls cancel each other out", explanationIfWrong: "They do not cancel; they evaluate 0 + 1." },
            { id: "D", text: "NaN due to concurrency conflicts", explanationIfWrong: "React handles batches deterministically." }
          ],
          correctAnswer: "A",
          explanationNote: "In a single render snapshot, `count` is 0, so `setCount(0 + 1)` is queued three times. To reach 3, use `setCount(c => c + 1)`."
        }
      },
      {
        heading: "Asynchronous Batched State Updates",
        text: "State updates in React are asynchronous and batched. Reading state immediately on the next line after calling a setter will still show the old value.",
        codeSnippet: `const [count, setCount] = useState(0);\n\nconst handleClick = () => {\n  setCount(count + 1);\n  console.log(count); // Still logs 0! Re-render hasn't happened yet\n};`,
        terminalOutput: `Console: 0 (State update is scheduled for the upcoming render pass)`,
        mcq: {
          id: "q-1.4-3-v1",
          question: "Why does `console.log(count)` immediately after `setCount(count + 1)` still print the old value of `count`?",
          options: [
            { id: "A", text: "State updates are scheduled asynchronously; the local variable `count` remains constant throughout the current function execution", explanationIfWrong: "" },
            { id: "B", text: "console.log() is an asynchronous browser API that lags behind React", explanationIfWrong: "console.log is synchronous; it logs the current value of the variable." },
            { id: "C", text: "React failed to register the click event", explanationIfWrong: "The event succeeded; the setter scheduled a future update." },
            { id: "D", text: "setCount only updates if the component unmounts", explanationIfWrong: "setCount updates active mounted components." }
          ],
          correctAnswer: "A",
          explanationNote: "Within a single render execution, `count` is a constant. Calling `setCount` requests a new render where `count` will have the new value."
        },
        retestMcq: {
          id: "q-1.4-3-v2",
          question: "What is 'batching' in React's state management architecture?",
          options: [
            { id: "A", text: "Grouping multiple state updates from a single event into one re-render pass for optimal performance", explanationIfWrong: "" },
            { id: "B", text: "Compressing state into a .zip archive before transmission", explanationIfWrong: "Batching has nothing to do with zip compression." },
            { id: "C", text: "Saving state to five databases at the same time", explanationIfWrong: "React does not interface with server databases directly." },
            { id: "D", text: "Executing state setters in random order", explanationIfWrong: "Updates are processed in strict deterministic order." }
          ],
          correctAnswer: "A",
          explanationNote: "React automatically batches multiple state setter calls into a single re-render to avoid unnecessary DOM paints."
        }
      },
      {
        heading: "Multiple State Variables vs Single Object State",
        text: "You can call `useState` multiple times to keep independent pieces of state separated, which is often cleaner than combining them into a complex object.",
        codeSnippet: `// Clean & separated:\nconst [left, setLeft] = useState(0);\nconst [right, setRight] = useState(0);\n\n// Updating one doesn't require spreading the other:\nsetLeft(prev => prev + 1);`,
        terminalOutput: `Left: 1, Right: 0`,
        mcq: {
          id: "q-1.4-4-v1",
          question: "What is an advantage of splitting state into multiple `useState` calls (e.g. `[left, setLeft]` and `[right, setRight]`)?",
          options: [
            { id: "A", text: "Updating one state variable does not require manually copying or spreading the other variables", explanationIfWrong: "" },
            { id: "B", text: "React limits components to only 10 state setters total", explanationIfWrong: "There is no arbitrary limit on useState calls." },
            { id: "C", text: "Splitting state converts the component into a multi-threaded process", explanationIfWrong: "React still executes in a single UI thread." },
            { id: "D", text: "It bypasses the need for React Virtual DOM reconciliation", explanationIfWrong: "All React state changes go through reconciliation." }
          ],
          correctAnswer: "A",
          explanationNote: "Unlike class component `setState`, `useState` does not automatically merge object properties. Splitting state avoids manual spreading `{ ...state, left: state.left + 1 }`."
        },
        retestMcq: {
          id: "q-1.4-4-v2",
          question: "If you store state as an object `const [clicks, setClicks] = useState({ left: 0, right: 0 })`, how must you update `left`?",
          options: [
            { id: "A", text: "`setClicks({ ...clicks, left: clicks.left + 1 })` to preserve the `right` property", explanationIfWrong: "" },
            { id: "B", text: "`setClicks({ left: clicks.left + 1 })` without spreading", explanationIfWrong: "This will completely erase the 'right' property from state!" },
            { id: "C", text: "`clicks.left = clicks.left + 1`", explanationIfWrong: "Mutating state directly does not trigger re-render." },
            { id: "D", text: "`setClicks.left(clicks.left + 1)`", explanationIfWrong: "setClicks is a function, not an object with property setters." }
          ],
          correctAnswer: "A",
          explanationNote: "Because `useState` replaces the entire state value rather than merging, you must manually spread `{ ...clicks }` to preserve unchanged properties."
        }
      },
      {
        heading: "Handling Arrays in State",
        text: "When managing an array in state (such as a click history), always create and return a new array using `.concat()` or the spread operator `[...allClicks, 'L']`.",
        codeSnippet: `const [allClicks, setAllClicks] = useState([]);\n\nconst handleLeftClick = () => {\n  // ✅ Concatenates into a brand-new array\n  setAllClicks(allClicks.concat('L'));\n};`,
        terminalOutput: `allClicks = ['L', 'L', 'R'] (rendered cleanly via allClicks.join(' '))`,
        mcq: {
          id: "q-1.4-5-v1",
          question: "Why should `allClicks.concat('L')` be used instead of `allClicks.push('L')` when updating state?",
          options: [
            { id: "A", text: "`.concat()` returns a new array copy, whereas `.push()` mutates the existing state array in-place", explanationIfWrong: "" },
            { id: "B", text: "`.push()` is only supported in legacy Internet Explorer browsers", explanationIfWrong: "push is standard in all JS engines." },
            { id: "C", text: "`.concat()` executes 10x faster than `.push()`", explanationIfWrong: "Performance differences are negligible; immutability is the concern." },
            { id: "D", text: "`.push()` deletes all previous array items", explanationIfWrong: "push appends an item; it doesn't delete items." }
          ],
          correctAnswer: "A",
          explanationNote: "In React, state must be treated as immutable. `.concat()` returns a new array, while `.push()` mutates the existing array in-place."
        },
        retestMcq: {
          id: "q-1.4-5-v2",
          question: "Which of the following is equivalent to `allClicks.concat('R')` using modern ES6 array spread syntax?",
          options: [
            { id: "A", text: "`[...allClicks, 'R']`", explanationIfWrong: "" },
            { id: "B", text: "`[allClicks, 'R']`", explanationIfWrong: "This nests the original array inside a new array [[...], 'R']." },
            { id: "C", text: "`{...allClicks, 'R'}`", explanationIfWrong: "Curly braces create an object, not an array." },
            { id: "D", text: "`allClicks[+ 'R']`", explanationIfWrong: "Invalid syntax." }
          ],
          correctAnswer: "A",
          explanationNote: "`[...allClicks, 'R']` spreads the elements of the original array into a fresh array literal and appends `'R'` to the end."
        }
      }
    ]
  },
  {
    id: "1-5-event-handling-callbacks",
    number: "1.5",
    title: "Event Handling & Passing Functions",
    subtitle: "Master event listeners, function references vs invocations, passing handler callbacks to children, and higher-order functions.",
    readTime: "14 min",
    objectives: [
      "Attach event listeners (onClick, onChange) in JSX",
      "Differentiate between passing a function reference vs calling a function",
      "Pass event handler callback functions down to child components",
      "Create higher-order functions that return custom event handlers",
      "Access synthetic event objects in event handlers",
      "Prevent common infinite re-render loops caused by immediate invocations"
    ],
    theoryBlocks: [
      {
        heading: "Event Handlers in JSX",
        text: "Event handlers are passed as function references to JSX attributes (like `onClick={handleClick}`). They run when the specified user event occurs.",
        codeSnippet: `const App = () => {\n  const handleClick = () => {\n    console.log('Button clicked!');\n  };\n\n  return <button onClick={handleClick}>Click Me</button>;\n};`,
        terminalOutput: `Console: Button clicked!`,
        mcq: {
          id: "q-1.5-0-v1",
          question: "In React, how must event handlers like `onClick` be defined?",
          options: [
            { id: "A", text: "As a function reference or arrow function definition: `onClick={handleClick}`", explanationIfWrong: "" },
            { id: "B", text: "As a string of JavaScript code: `onClick='handleClick()'`", explanationIfWrong: "Strings were used in legacy HTML (onclick='...'), but React requires function references." },
            { id: "C", text: "Inside a CSS media query selector", explanationIfWrong: "CSS handles styling, not JavaScript event listeners." },
            { id: "D", text: "As an immediate function invocation: `onClick={handleClick()}`", explanationIfWrong: "Immediate invocation calls the function during render, not on click!" }
          ],
          correctAnswer: "A",
          explanationNote: "In React, event handlers must be functions or function references (`handleClick`), not strings or immediate function calls."
        },
        retestMcq: {
          id: "q-1.5-0-v2",
          question: "What is the difference between HTML `onclick` and React `onClick`?",
          options: [
            { id: "A", text: "React uses camelCase (`onClick`) and takes a function reference, whereas HTML uses lowercase (`onclick`) and takes a string", explanationIfWrong: "" },
            { id: "B", text: "HTML onclick handles keyboard events, while React onClick does not", explanationIfWrong: "Both handle clicks; syntax and evaluation differ." },
            { id: "C", text: "React onClick only works on touchscreens", explanationIfWrong: "onClick works on mouse, touch, and keyboard trigger." },
            { id: "D", text: "HTML onclick executes asynchronously, while React onClick is blocking", explanationIfWrong: "Both execute synchronously when clicked." }
          ],
          correctAnswer: "A",
          explanationNote: "React JSX uses camelCase attribute naming (`onClick`, `onChange`) and receives actual JavaScript function references rather than code strings."
        }
      },
      {
        heading: "Function Reference vs Immediate Invocation",
        text: "Passing `onClick={handleClick}` passes the function so it runs on click. Writing `onClick={handleClick()}` runs it immediately during render, often causing infinite re-render loops.",
        codeSnippet: `// ❌ BUG: Runs immediately during render; triggers loop if setting state!\n<button onClick={setCounter(counter + 1)}>Increment</button>\n\n// ✅ CORRECT: Inline arrow function waits for user click\n<button onClick={() => setCounter(counter + 1)}>Increment</button>`,
        terminalOutput: `Error if bad: Too many re-renders. React limits the number of renders to prevent an infinite loop.`,
        mcq: {
          id: "q-1.5-1-v1",
          question: "What error occurs if you write `<button onClick={setValue(10)}>` where `setValue` is a state setter?",
          options: [
            { id: "A", text: "`setValue(10)` runs immediately during rendering, setting state and causing an infinite re-render crash", explanationIfWrong: "" },
            { id: "B", text: "The browser tab automatically navigates to Google", explanationIfWrong: "No navigation occurs." },
            { id: "C", text: "The button becomes permanently disabled in the DOM", explanationIfWrong: "The button is not disabled; React halts with an infinite loop error." },
            { id: "D", text: "React converts the button into an input field", explanationIfWrong: "Tags are not converted." }
          ],
          correctAnswer: "A",
          explanationNote: "Invoking a function in JSX executes it while rendering. If that function sets state, it triggers another render immediately, resulting in an infinite loop."
        },
        retestMcq: {
          id: "q-1.5-1-v2",
          question: "How do you pass a parameter (like id: 5) to an event handler without invoking it during render?",
          options: [
            { id: "A", text: "`onClick={() => handleDelete(5)}` wrapped in an arrow function", explanationIfWrong: "" },
            { id: "B", text: "`onClick={handleDelete(5)}`", explanationIfWrong: "This invokes handleDelete immediately during render." },
            { id: "C", text: "`onClick={handleDelete[5]}`", explanationIfWrong: "Bracket notation accesses array indices or object properties." },
            { id: "D", text: "`onClick: handleDelete(5)`", explanationIfWrong: "Colons are invalid JSX prop syntax." }
          ],
          correctAnswer: "A",
          explanationNote: "Wrapping the function call in an arrow function `() => handleDelete(5)` ensures the function is executed only when the user actually triggers the event."
        }
      },
      {
        heading: "Passing Event Handlers to Child Components",
        text: "You can pass handler functions as props to child components (e.g. `<Button handleClick={increment} text=\"plus\" />`) to keep buttons reusable.",
        codeSnippet: `const Button = ({ handleClick, text }) => (\n  <button onClick={handleClick}>\n    {text}\n  </button>\n);\n\n// Usage in Parent:\n<Button handleClick={() => setCounter(c => c + 1)} text="Increment" />`,
        terminalOutput: `Modular Button renders <button> and triggers parent state callback on click`,
        mcq: {
          id: "q-1.5-2-v1",
          question: "Why should you extract reusable components like `<Button handleClick={...} text={...} />`?",
          options: [
            { id: "A", text: "It encapsulates styling and behavior while letting the parent control the action via callback props", explanationIfWrong: "" },
            { id: "B", text: "It prevents React from running garbage collection", explanationIfWrong: "Garbage collection is managed by the JavaScript engine." },
            { id: "C", text: "It makes web pages render without CSS", explanationIfWrong: "CSS functions normally with reusable components." },
            { id: "D", text: "Child components run on server-side databases", explanationIfWrong: "Child components render in the client browser." }
          ],
          correctAnswer: "A",
          explanationNote: "Passing callback functions as props lets child components remain purely presentational while allowing parents to manage state logic."
        },
        retestMcq: {
          id: "q-1.5-2-v2",
          question: "Can an HTML `<button>` receive a custom prop name like `handleClick` directly?",
          options: [
            { id: "A", text: "No, native HTML tags only recognize standard DOM attributes like `onClick`; custom props belong on custom React components", explanationIfWrong: "" },
            { id: "B", text: "Yes, HTML tags accept any arbitrary event attribute name", explanationIfWrong: "Native DOM elements only listen to standard DOM events like onclick." },
            { id: "C", text: "Only if jQuery is imported in index.html", explanationIfWrong: "React does not use jQuery." },
            { id: "D", text: "Only in development mode", explanationIfWrong: "HTML attributes are standardized across dev and prod." }
          ],
          correctAnswer: "A",
          explanationNote: "Custom prop names like `handleClick` are defined on custom React components. Inside the component, it must be mapped to a native DOM event like `onClick`."
        }
      },
      {
        heading: "Functions that Return Functions (Higher-Order)",
        text: "A function that returns another function is useful when configuring event handlers with parameters without repeating arrow function wrappers.",
        codeSnippet: `const setToValue = (newValue) => {\n  return () => {\n    setValue(newValue);\n  };\n};\n\n// In JSX:\n<button onClick={setToValue(1000)}>Thousand</button>\n<button onClick={setToValue(0)}>Reset</button>`,
        terminalOutput: `Clicking 'Thousand' invokes the returned function () => setValue(1000)`,
        mcq: {
          id: "q-1.5-3-v1",
          question: "In `const hello = (who) => () => console.log('hello', who)`, what does `hello('world')` return?",
          options: [
            { id: "A", text: "A function that, when executed, will log 'hello world'", explanationIfWrong: "" },
            { id: "B", text: "The string 'hello world' immediately", explanationIfWrong: "It returns a function closure, not a string directly." },
            { id: "C", text: "A resolved Promise", explanationIfWrong: "No Promise is created." },
            { id: "D", text: "undefined", explanationIfWrong: "It returns an arrow function () => ..." }
          ],
          correctAnswer: "A",
          explanationNote: "This is a higher-order function: `hello('world')` returns an inner function that retains access to `'world'` via lexical closure."
        },
        retestMcq: {
          id: "q-1.5-3-v2",
          question: "Why is `<button onClick={setToValue(0)}>` valid when `setToValue` returns a function?",
          options: [
            { id: "A", text: "Because invoking `setToValue(0)` evaluates to a function, which is exactly what `onClick` expects", explanationIfWrong: "" },
            { id: "B", text: "Because React skips function execution if 0 is passed", explanationIfWrong: "React does not skip functions based on 0." },
            { id: "C", text: "Because setToValue is compiled into a string at runtime", explanationIfWrong: "It is evaluated as an actual JavaScript function reference." },
            { id: "D", text: "Because buttons automatically prevent immediate execution", explanationIfWrong: "Buttons have no awareness of JS return types." }
          ],
          correctAnswer: "A",
          explanationNote: "Because `setToValue(0)` returns a function, the `onClick` prop receives that returned function as its event handler."
        }
      },
      {
        heading: "Synthetic Event Object (`event.target`)",
        text: "React wraps native browser events in a cross-browser `SyntheticEvent` object, giving you access to `event.target.value` and `event.preventDefault()`.",
        codeSnippet: `const handleInputChange = (event) => {\n  console.log('User typed:', event.target.value);\n};\n\nreturn <input onChange={handleInputChange} />;`,
        terminalOutput: `User typed: Full Stack Open`,
        mcq: {
          id: "q-1.5-4-v1",
          question: "What is `event.target` in a React event handler?",
          options: [
            { id: "A", text: "The specific DOM element that dispatched the event (e.g., the input or button)", explanationIfWrong: "" },
            { id: "B", text: "The React root DOM container", explanationIfWrong: "The root container holds the whole app, not the specific target." },
            { id: "C", text: "The URL of the API endpoint being called", explanationIfWrong: "Events are DOM interaction objects, not API endpoints." },
            { id: "D", text: "The previous state of the component", explanationIfWrong: "event.target is a DOM node, not component state." }
          ],
          correctAnswer: "A",
          explanationNote: "`event.target` points directly to the DOM element that initiated the event, allowing you to read properties like `event.target.value`."
        },
        retestMcq: {
          id: "q-1.5-4-v2",
          question: "Why does React wrap native browser DOM events in a `SyntheticEvent`?",
          options: [
            { id: "A", text: "To normalize event behaviors and provide consistent cross-browser compatibility across all platforms", explanationIfWrong: "" },
            { id: "B", text: "To encrypt user keyboard strokes for data privacy", explanationIfWrong: "Synthetic events do not encrypt keystrokes." },
            { id: "C", text: "To translate keyboard events into foreign languages", explanationIfWrong: "Synthetic events are for cross-browser consistency, not language translation." },
            { id: "D", text: "To slow down fast typers", explanationIfWrong: "Synthetic events are lightweight and performant." }
          ],
          correctAnswer: "A",
          explanationNote: "React's SyntheticEvent wrapper ensures that events have identical properties and behavior regardless of the underlying browser."
        }
      },
      {
        heading: "Preventing Form Submissions (`event.preventDefault()`)",
        text: "By default, submitting an HTML form reloads the whole browser page. In React SPAs, call `event.preventDefault()` to stop the reload and handle data in JavaScript.",
        codeSnippet: `const handleSubmit = (event) => {\n  event.preventDefault(); // Stops full page reload\n  console.log('Form submitted without reloading page!');\n};\n\nreturn <form onSubmit={handleSubmit}><button type="submit">Save</button></form>;`,
        terminalOutput: `Page stays active; React state & inputs are preserved`,
        mcq: {
          id: "q-1.5-5-v1",
          question: "What happens if you omit `event.preventDefault()` inside a form's `onSubmit` handler in a React Single Page Application?",
          options: [
            { id: "A", text: "The browser performs its default HTTP POST/GET action, reloading the page and resetting all React state", explanationIfWrong: "" },
            { id: "B", text: "The form inputs are automatically encrypted", explanationIfWrong: "Forms do not encrypt data automatically." },
            { id: "C", text: "React throws an unrecoverable syntax compilation error", explanationIfWrong: "The code compiles; the browser simply performs its native reload." },
            { id: "D", text: "The computer will shut down", explanationIfWrong: "Omitting preventDefault just reloads the page." }
          ],
          correctAnswer: "A",
          explanationNote: "Standard HTML forms reload the page on submission. In React SPAs, `event.preventDefault()` suppresses the reload so JavaScript handles the submission."
        },
        retestMcq: {
          id: "q-1.5-5-v2",
          question: "Where should `event.preventDefault()` be placed when handling form submissions in React?",
          options: [
            { id: "A", text: "At the start of the `onSubmit` handler function", explanationIfWrong: "" },
            { id: "B", text: "Inside the CSS style tag", explanationIfWrong: "CSS cannot execute JavaScript preventDefault." },
            { id: "C", text: "In the HTML doctype declaration", explanationIfWrong: "Doctype is an HTML preamble." },
            { id: "D", text: "In package.json under scripts", explanationIfWrong: "package.json defines project dependencies and CLI scripts." }
          ],
          correctAnswer: "A",
          explanationNote: "Calling `event.preventDefault()` at the beginning of the `onSubmit` handler immediately halts the browser's default submission behavior."
        }
      }
    ]
  },
  {
    id: "1-6-complex-state-rules-of-hooks",
    number: "1.6",
    title: "Conditional Rendering, Rules of Hooks & Debugging",
    subtitle: "Master conditional UI rendering (&&, ternary), early returns, the strict Rules of Hooks, and React DevTools debugging.",
    readTime: "16 min",
    objectives: [
      "Implement conditional rendering using ternary operators and logical AND (&&)",
      "Use early return statements to render empty or fallback states",
      "Follow the two official Rules of Hooks (top-level only, React functions only)",
      "Debug React component props and state using browser console and React DevTools",
      "Handle edge cases and avoid rendering unexpected 0s with &&",
      "Structure a complete production-grade Part 1 React application"
    ],
    theoryBlocks: [
      {
        heading: "Conditional Rendering with Ternary (`? :`)",
        text: "The ternary operator (`condition ? <TrueComponent /> : <FalseComponent />`) is the standard way to render one of two alternate UI elements based on state.",
        codeSnippet: `const Notification = ({ message }) => {\n  return (\n    <div>\n      {message ? <p className="alert">{message}</p> : <p>No alerts</p>}\n    </div>\n  );\n};`,
        terminalOutput: `Renders alert if message exists; renders 'No alerts' otherwise`,
        mcq: {
          id: "q-1.6-0-v1",
          question: "When should you choose a ternary operator `condition ? <A /> : <B />` in JSX?",
          options: [
            { id: "A", text: "When you need to choose between rendering two mutually exclusive UI outputs based on a condition", explanationIfWrong: "" },
            { id: "B", text: "When you want to repeat an element 10 times in a loop", explanationIfWrong: "Loops in JSX use Array.prototype.map()." },
            { id: "C", text: "Only when rendering image files", explanationIfWrong: "Ternary operators work with any React elements or values." },
            { id: "D", text: "When connecting to a WebSocket server", explanationIfWrong: "WebSockets use connection APIs, not ternary operators." }
          ],
          correctAnswer: "A",
          explanationNote: "The ternary operator `condition ? ifTrue : ifFalse` is ideal in JSX because it is an expression that evaluates directly to one of two elements."
        },
        retestMcq: {
          id: "q-1.6-0-v2",
          question: "Can standard `if ... else` statements be placed directly inside JSX curly braces `{}`?",
          options: [
            { id: "A", text: "No, because `if` is a statement, not an expression that evaluates to a value", explanationIfWrong: "" },
            { id: "B", text: "Yes, any JavaScript syntax can be placed inside JSX curly braces", explanationIfWrong: "JSX only accepts expressions, not statements like if, for, or while." },
            { id: "C", text: "Only if preceded by the 'use strict' directive", explanationIfWrong: "Directives do not change JSX expression grammar." },
            { id: "D", text: "Only in React version 17 and below", explanationIfWrong: "This is a fundamental JavaScript expression limitation across all React versions." }
          ],
          correctAnswer: "A",
          explanationNote: "JSX only accepts JavaScript expressions (values, ternaries, function calls). Statements like `if` or `for` must be placed outside the return statement."
        }
      },
      {
        heading: "Conditional Rendering with Logical AND (`&&`)",
        text: "When you want to render an element only if a condition is true (and render nothing if false), use the short-circuit `condition && <Component />` syntax.",
        codeSnippet: `const Header = ({ unreadCount }) => (\n  <header>\n    <h1>Inbox</h1>\n    {unreadCount > 0 && <span className="badge">{unreadCount} unread</span>}\n  </header>\n);`,
        terminalOutput: `Renders badge if unreadCount > 0; renders nothing if false`,
        mcq: {
          id: "q-1.6-1-v1",
          question: "How does the short-circuit logical AND `condition && <Component />` work in JSX?",
          options: [
            { id: "A", text: "If the condition is truthy, it renders the component; if falsy, React ignores and renders nothing", explanationIfWrong: "" },
            { id: "B", text: "It executes both sides concurrently on two background threads", explanationIfWrong: "Logical AND is a standard synchronous short-circuit operator." },
            { id: "C", text: "It converts the component to a boolean true in the DOM", explanationIfWrong: "React does not render booleans to the DOM." },
            { id: "D", text: "It repeats the component twice", explanationIfWrong: "It renders the component once if the left condition is truthy." }
          ],
          correctAnswer: "A",
          explanationNote: "In JavaScript, `true && expression` evaluates to `expression`. If false, it evaluates to `false`, which React ignores and does not render."
        },
        retestMcq: {
          id: "q-1.6-1-v2",
          question: "Why is writing `items.length && <List />` dangerous if `items.length` is 0?",
          options: [
            { id: "A", text: "Because `0` is falsy, the expression evaluates to `0`, causing the number `0` to render on the screen", explanationIfWrong: "" },
            { id: "B", text: "It causes an unhandled index out of bounds error", explanationIfWrong: "No index access is happening." },
            { id: "C", text: "It crashes the browser's JavaScript engine", explanationIfWrong: "It does not crash; it just displays an accidental '0'." },
            { id: "D", text: "It deletes the items array", explanationIfWrong: "It does not mutate the array." }
          ],
          correctAnswer: "A",
          explanationNote: "Because numbers like `0` are rendered by React, `0 && <List />` outputs `0`. Write `items.length > 0 && <List />` to ensure a true boolean."
        }
      },
      {
        heading: "Early Returns for Conditional Screens",
        text: "You can return early from a component function before reaching the main JSX if a certain condition is met (such as empty data or loading state).",
        codeSnippet: `const History = ({ allClicks }) => {\n  if (allClicks.length === 0) {\n    return <p>This app is used by pressing the buttons.</p>;\n  }\n\n  return <p>Button press history: {allClicks.join(' ')}</p>;\n};`,
        terminalOutput: `Renders instruction text initially; switches to click history as soon as user clicks`,
        mcq: {
          id: "q-1.6-2-v1",
          question: "What is the benefit of using an early return `if (data.length === 0) return <EmptyState />;`?",
          options: [
            { id: "A", text: "It prevents complex nested ternaries in the main JSX and separates edge-case rendering cleanly", explanationIfWrong: "" },
            { id: "B", text: "It stops other sibling components from updating", explanationIfWrong: "Early returns only affect the local component." },
            { id: "C", text: "It forces the browser to re-request the HTML from the server", explanationIfWrong: "Early returns are client-side JavaScript." },
            { id: "D", text: "It prevents memory leaks by closing the browser tab", explanationIfWrong: "Early returns do not close tabs." }
          ],
          correctAnswer: "A",
          explanationNote: "Early returns allow handling loading, error, or empty states at the top of a component without nesting ternary statements in the JSX."
        },
        retestMcq: {
          id: "q-1.6-2-v2",
          question: "If a component returns `null` from its render function, what appears on the screen?",
          options: [
            { id: "A", text: "Nothing at all; the component renders blank and produces no DOM elements", explanationIfWrong: "" },
            { id: "B", text: "The text string 'null' is printed in black", explanationIfWrong: "React explicitly renders nothing for null." },
            { id: "C", text: "A blank white box with a red error border", explanationIfWrong: "Returning null is an intentional, valid way to hide a component." },
            { id: "D", text: "A browser alert popup", explanationIfWrong: "No alert is triggered." }
          ],
          correctAnswer: "A",
          explanationNote: "Returning `null` from a component is a standard React pattern to completely hide a component without unmounting its parent."
        }
      },
      {
        heading: "The Rules of Hooks (Top-Level Only)",
        text: "Hooks must only be called at the top level of your React function. Never call hooks inside loops, conditions (`if`), or nested functions.",
        codeSnippet: `// ❌ WRONG: Violates Rules of Hooks!\nif (condition) {\n  const [count, setCount] = useState(0);\n}\n\n// ✅ CORRECT: Always called unconditionally at the top level\nconst [count, setCount] = useState(0);`,
        terminalOutput: `Error if bad: React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render.`,
        mcq: {
          id: "q-1.6-3-v1",
          question: "Why must React Hooks like `useState` be called unconditionally at the top level of a component?",
          options: [
            { id: "A", text: "React relies on the exact call order of hooks across re-renders to associate state with the component", explanationIfWrong: "" },
            { id: "B", text: "JavaScript engine parsers throw a syntax error if functions are inside conditions", explanationIfWrong: "JavaScript allows functions inside conditions; React's hook engine forbids it." },
            { id: "C", text: "Hooks can only be called from inside CSS files", explanationIfWrong: "Hooks are JavaScript functions." },
            { id: "D", text: "Calling hooks inside loops makes the computer fan run faster", explanationIfWrong: "It causes React state mismatches and crashes." }
          ],
          correctAnswer: "A",
          explanationNote: "React tracks hooks using internal indexed lists based on execution order. Conditions or loops would alter the order between renders, corrupting state."
        },
        retestMcq: {
          id: "q-1.6-3-v2",
          question: "From where are you permitted to call React Hooks?",
          options: [
            { id: "A", text: "Only from React functional components or custom hooks", explanationIfWrong: "" },
            { id: "B", text: "From any regular JavaScript utility function or Node.js script", explanationIfWrong: "Hooks cannot be called from regular utility functions unless they are custom hooks." },
            { id: "C", text: "Directly inside HTML script tags in the browser console", explanationIfWrong: "Hooks require React's dispatcher context." },
            { id: "D", text: "Inside standard ES6 class constructors", explanationIfWrong: "Hooks are designed exclusively for functional components." }
          ],
          correctAnswer: "A",
          explanationNote: "Rule of Hooks #2: Only call Hooks from React function components or custom Hooks (functions whose names begin with `use`)."
        }
      },
      {
        heading: "Debugging React: Console & React DevTools",
        text: "Use `console.log()` to inspect props and state during renders, and install the official React Developer Tools browser extension to inspect the live Virtual DOM tree.",
        codeSnippet: `const Button = ({ handleClick, text }) => {\n  console.log('Rendering Button with text:', text);\n  return <button onClick={handleClick}>{text}</button>;\n};`,
        terminalOutput: `Console: Rendering Button with text: Increment`,
        mcq: {
          id: "q-1.6-4-v1",
          question: "What does the official React Developer Tools browser extension allow developers to inspect?",
          options: [
            { id: "A", text: "The live React component hierarchy tree, including the current props and state of every component", explanationIfWrong: "" },
            { id: "B", text: "The server's physical CPU temperature", explanationIfWrong: "DevTools inspects browser web applications." },
            { id: "C", text: "Raw binary machine assembly code", explanationIfWrong: "It displays high-level React components." },
            { id: "D", text: "The user's saved browser passwords", explanationIfWrong: "DevTools cannot access sensitive browser credentials." }
          ],
          correctAnswer: "A",
          explanationNote: "React DevTools lets you inspect component trees, edit props and state in real-time, view render timing, and track re-renders."
        },
        retestMcq: {
          id: "q-1.6-4-v2",
          question: "When debugging with `console.log('props is', props)`, why is comma separation preferred over string concatenation `+`?",
          options: [
            { id: "A", text: "Comma separation logs the interactive expandable object, whereas `+` converts it to the useless string `'[object Object]'`", explanationIfWrong: "" },
            { id: "B", text: "Comma separation runs in background threads", explanationIfWrong: "Both execute synchronously." },
            { id: "C", text: "String concatenation crashes the browser console", explanationIfWrong: "It does not crash; it just prints '[object Object]'." },
            { id: "D", text: "Comma separation automatically formats data as XML", explanationIfWrong: "Console displays interactive JS object representations." }
          ],
          correctAnswer: "A",
          explanationNote: "Using `console.log('props:', props)` preserves the object structure for inspection, whereas `'props: ' + props` converts it into `'[object Object]'`."
        }
      },
      {
        heading: "Synthesizing Part 1: Full React Application",
        text: "A well-architected React application combines modular components, immutable state updates, event callbacks, and conditional rendering into a clean declarative UI.",
        codeSnippet: `const App = () => {\n  const [good, setGood] = useState(0);\n  const [neutral, setNeutral] = useState(0);\n  const [bad, setBad] = useState(0);\n\n  const total = good + neutral + bad;\n  const positive = total ? (good / total) * 100 : 0;\n\n  return (\n    <div>\n      <h1>Give Feedback</h1>\n      <button onClick={() => setGood(g => g + 1)}>Good</button>\n      <button onClick={() => setNeutral(n => n + 1)}>Neutral</button>\n      <button onClick={() => setBad(b => b + 1)}>Bad</button>\n      <h2>Statistics</h2>\n      {total > 0 ? <p>Positive: {positive.toFixed(1)}%</p> : <p>No feedback given</p>}\n    </div>\n  );\n};`,
        terminalOutput: `Live interactive application matching Helsinki Part 1 Unicafe project!`,
        mcq: {
          id: "q-1.6-5-v1",
          question: "In the Unicafe feedback app above, why is `positive` calculated in the component body instead of being stored in a separate `useState` variable?",
          options: [
            { id: "A", text: "`positive` is derived state that can be computed synchronously from `good` and `total` without redundant state synchronization bugs", explanationIfWrong: "" },
            { id: "B", text: "React forbids storing percentages in useState", explanationIfWrong: "useState can store any valid value." },
            { id: "C", text: "Calculating in the body prevents the page from rendering", explanationIfWrong: "It computes values cleanly right as the component renders." },
            { id: "D", text: "State variables cannot hold numbers with decimal points", explanationIfWrong: "JavaScript numbers handle floating point decimals." }
          ],
          correctAnswer: "A",
          explanationNote: "Never store in state what can be easily calculated from existing state. Derived state avoids synchronization errors and keeps code simpler."
        },
        retestMcq: {
          id: "q-1.6-5-v2",
          question: "What core React philosophy is demonstrated by letting state drive UI re-renders without manual DOM manipulation?",
          options: [
            { id: "A", text: "Declarative programming: UI is a pure function of state (`UI = f(state)`)", explanationIfWrong: "" },
            { id: "B", text: "Imperative programming with manual document.getElementById updates", explanationIfWrong: "Imperative DOM manipulation is what React replaces." },
            { id: "C", text: "Object-oriented inheritance patterns", explanationIfWrong: "React functional components rely on composition." },
            { id: "D", text: "Direct database storage manipulation", explanationIfWrong: "Databases are handled via server APIs." }
          ],
          correctAnswer: "A",
          explanationNote: "React is declarative: you describe what the UI should look like for a given state, and React automatically updates the DOM to match."
        }
      }
    ]
  }
];

// Helper functions for Level attempts, question selection, and 3-consecutive-failure progression lock
export const getLevelAttemptCountFullstackPart1 = (sectionId: string, studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_fullstack_p1_attempt_${sectionId}_${studentId}`);
    return saved ? Number(saved) : 1;
  } catch {
    return 1;
  }
};

export const setLevelAttemptCountFullstackPart1 = (sectionId: string, studentId: string, count: number): void => {
  try {
    localStorage.setItem(`dopilot_fullstack_p1_attempt_${sectionId}_${studentId}`, String(count));
  } catch {}
};

export const getActiveQuestionsForLevelFullstackPart1 = (
  section: SectionContent,
  studentId: string,
  forceRetest: boolean = false
): McqQuestion[] => {
  const attempt = forceRetest ? 2 : getLevelAttemptCountFullstackPart1(section.id, studentId);
  return section.theoryBlocks.map((block) => {
    if (attempt >= 2 && block.retestMcq) {
      return block.retestMcq;
    }
    return block.mcq!;
  });
};

export const getConsecutiveFailedLevelsFullstackPart1 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_fullstack_p1_failed_levels_streak_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const recordLevelAttemptResultFullstackPart1 = (
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
  const currentAttempt = getLevelAttemptCountFullstackPart1(sectionId, studentId);

  if (isPassed) {
    try {
      localStorage.setItem(`dopilot_fullstack_p1_failed_levels_streak_${studentId}`, '0');
      localStorage.setItem(`dopilot_fullstack_p1_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_fullstack_p1_attempt_${sectionId}_${studentId}`, '1');
      localStorage.removeItem(`dopilot_fullstack_p1_locked_${studentId}`);
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
      setLevelAttemptCountFullstackPart1(sectionId, studentId, 2);
      const streak = getConsecutiveFailedLevelsFullstackPart1(studentId);

      return {
        isPassed: false,
        attemptCount: 1,
        isSecondFailureInLevel: false,
        consecutiveFailedLevels: streak,
        isLocked: false
      };
    } else {
      const prevStreak = getConsecutiveFailedLevelsFullstackPart1(studentId);
      const newStreak = prevStreak + 1;
      const isLocked = newStreak >= 3;

      try {
        localStorage.setItem(`dopilot_fullstack_p1_failed_levels_streak_${studentId}`, String(newStreak));
        localStorage.setItem(`dopilot_fullstack_p1_consecutive_failures_${studentId}`, String(newStreak));
        if (isLocked) {
          localStorage.setItem(`dopilot_fullstack_p1_locked_${studentId}`, 'true');
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

export const resetConsecutiveFailuresFullstackPart1 = (studentId: string): void => {
  try {
    localStorage.setItem(`dopilot_fullstack_p1_consecutive_failures_${studentId}`, '0');
    localStorage.setItem(`dopilot_fullstack_p1_failed_levels_streak_${studentId}`, '0');
    localStorage.removeItem(`dopilot_fullstack_p1_locked_${studentId}`);
  } catch {}
};
