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

export const FULLSTACK_PART_2_SECTIONS: SectionContent[] = [
  {
    id: "2-1-rendering-collections-keys",
    number: "2.1",
    title: "Rendering Collections & Unique Keys",
    subtitle: "Render dynamic lists using .map(), satisfy React's key prop requirement, and understand Virtual DOM reconciliation.",
    readTime: "12 min",
    objectives: [
      "Transform arrays of data into JSX element lists using Array.prototype.map()",
      "Understand why React requires a unique `key` prop on mapped list items",
      "Explain Virtual DOM reconciliation and how keys preserve component identity",
      "Recognize why using array indices as keys is an anti-pattern for dynamic collections",
      "Refactor list rendering into dedicated child components",
      "Handle empty collections gracefully in UI"
    ],
    theoryBlocks: [
      {
        heading: "Rendering Arrays of Objects with .map()",
        text: "In React, dynamic collections are rendered by mapping an array of data objects into an array of JSX elements using `.map()`.",
        codeSnippet: `const notes = [\n  { id: 1, content: 'HTML is easy' },\n  { id: 2, content: 'Browser can execute only JS' }\n];\n\nreturn (\n  <ul>\n    {notes.map(note => <li key={note.id}>{note.content}</li>)}\n  </ul>\n);`,
        terminalOutput: `<ul>\n  <li>HTML is easy</li>\n  <li>Browser can execute only JS</li>\n</ul>`,
        mcq: {
          id: "q-2.1-0-v1",
          question: "How does React render a list of objects from an array into DOM elements?",
          options: [
            { id: "A", text: "By using `.map()` inside JSX curly braces to return a JSX element for each object", explanationIfWrong: "" },
            { id: "B", text: "By running a native for-loop directly inside the JSX return statement", explanationIfWrong: "Standard for-loops are statements and cannot be written directly inside JSX expressions." },
            { id: "C", text: "By converting the array into a CSV file downloaded by the browser", explanationIfWrong: "React does not generate CSV files for list rendering." },
            { id: "D", text: "By calling document.createElement inside a while-loop", explanationIfWrong: "React uses declarative Virtual DOM, not imperative document.createElement." }
          ],
          correctAnswer: "A",
          explanationNote: "The `.map()` array method returns a brand-new array of JSX elements that React embeds directly into the Virtual DOM."
        },
        retestMcq: {
          id: "q-2.1-0-v2",
          question: "What does `notes.map(note => <Note key={note.id} note={note} />)` evaluate to in React?",
          options: [
            { id: "A", text: "An array of React Virtual DOM elements ready to be rendered into the tree", explanationIfWrong: "" },
            { id: "B", text: "A single boolean true", explanationIfWrong: ".map() returns an array, not a boolean." },
            { id: "C", text: "A promise that executes after page reload", explanationIfWrong: ".map() runs synchronously." },
            { id: "D", text: "A mutated version of the original notes array", explanationIfWrong: ".map() never mutates the original array." }
          ],
          correctAnswer: "A",
          explanationNote: "Mapping an array of objects generates an array of React element descriptors that React reconciles into the DOM."
        }
      },
      {
        heading: "The Essential `key` Prop Requirement",
        text: "Every item in an array rendered by React must have a unique `key` prop so React can track which items changed, were added, or were removed.",
        codeSnippet: `// Each item needs a stable, unique identifier:\n{notes.map(note => (\n  <li key={note.id}>\n    {note.content}\n  </li>\n))}`,
        terminalOutput: `Warning if missing: Warning: Each child in a list should have a unique "key" prop.`,
        mcq: {
          id: "q-2.1-1-v1",
          question: "Why does React require a `key` prop on elements inside an iterated list?",
          options: [
            { id: "A", text: "To identify individual elements and optimize Virtual DOM reconciliation when lists change", explanationIfWrong: "" },
            { id: "B", text: "To encrypt the list data for security compliance", explanationIfWrong: "Keys are purely for DOM diffing performance, not encryption." },
            { id: "C", text: "To automatically sort items in alphabetical order", explanationIfWrong: "Keys do not sort items." },
            { id: "D", text: "To make list items clickable by default", explanationIfWrong: "Clickability is handled by onClick, not key." }
          ],
          correctAnswer: "A",
          explanationNote: "React's diffing algorithm uses `key` to match elements across renders, minimizing expensive DOM re-creation."
        },
        retestMcq: {
          id: "q-2.1-1-v2",
          question: "Where should the `key` prop be placed when rendering a custom child component in a list?",
          options: [
            { id: "A", text: "Directly on the outermost element inside the `.map()` callback (e.g., `<Note key={note.id} />`)", explanationIfWrong: "" },
            { id: "B", text: "Inside the child component's internal root HTML tag", explanationIfWrong: "The key must be placed in the map context where the list iteration occurs." },
            { id: "C", text: "On the parent `<ul>` container tag", explanationIfWrong: "The parent tag does not take the list item's key." },
            { id: "D", text: "In the index.html head tag", explanationIfWrong: "Keys are React component props." }
          ],
          correctAnswer: "A",
          explanationNote: "The `key` prop must always be defined in the context of the surrounding array iteration on the top-level element returned by `.map()`."
        }
      },
      {
        heading: "Why Array Index as Key is an Anti-Pattern",
        text: "Using array index (`key={index}`) is risky because inserting, deleting, or reordering items shifts indices, causing state corruption and UI rendering bugs.",
        codeSnippet: `// ❌ BAD: Can cause input & animation glitches when list changes\n{notes.map((note, index) => <li key={index}>{note.content}</li>)}\n\n// ✅ GOOD: Stable identifier tied directly to the record\n{notes.map(note => <li key={note.id}>{note.content}</li>)}`,
        terminalOutput: `Stable keys ensure input fields retain correct focus and values when list is filtered`,
        mcq: {
          id: "q-2.1-2-v1",
          question: "Why is using array index `key={index}` discouraged for dynamic collections in React?",
          options: [
            { id: "A", text: "If items are added, removed, or reordered, their indices change, confusing React's state tracking and causing UI bugs", explanationIfWrong: "" },
            { id: "B", text: "JavaScript engines do not support numbers as keys", explanationIfWrong: "Numbers are completely valid keys; stability is the issue." },
            { id: "C", text: "It causes Webpack build errors", explanationIfWrong: "It compiles fine; the issue is runtime DOM reconciliation." },
            { id: "D", text: "Indices require more CPU cycles to calculate than IDs", explanationIfWrong: "Index is already available; correctness is the problem." }
          ],
          correctAnswer: "A",
          explanationNote: "When items reorder or delete, an item's index changes. React reuses DOM nodes based on key, leading to input focus bugs and incorrect state."
        },
        retestMcq: {
          id: "q-2.1-2-v2",
          question: "Under what specific condition is using `index` as a key acceptable in React?",
          options: [
            { id: "A", text: "When the list is completely static (never filtered, reordered, or added to) and items have no natural IDs", explanationIfWrong: "" },
            { id: "B", text: "Whenever the list contains more than 10,000 items", explanationIfWrong: "Large dynamic lists suffer even more from index keys." },
            { id: "C", text: "When using TypeScript instead of JavaScript", explanationIfWrong: "Language choice does not change reconciliation mechanics." },
            { id: "D", text: "When items are fetched over WebSockets", explanationIfWrong: "WebSocket lists are dynamic and require stable IDs." }
          ],
          correctAnswer: "A",
          explanationNote: "Using array index as a key is only safe for static, immutable lists that are never filtered, sorted, or mutated."
        }
      },
      {
        heading: "Refactoring into Separate Component Modules",
        text: "Keep components clean and maintainable by extracting list item rendering into dedicated components (e.g., `Note.jsx`) and importing them.",
        codeSnippet: `// components/Note.jsx:\nconst Note = ({ note }) => {\n  return <li>{note.content}</li>;\n};\nexport default Note;\n\n// App.jsx:\nimport Note from './components/Note';\n// {notes.map(note => <Note key={note.id} note={note} />)}`,
        terminalOutput: `Modular architecture: Each file has a single responsibility`,
        mcq: {
          id: "q-2.1-3-v1",
          question: "What is the primary benefit of extracting a `Note` component into its own file (`Note.jsx`)?",
          options: [
            { id: "A", text: "Modularity, readability, reusability, and easier unit testing", explanationIfWrong: "" },
            { id: "B", text: "It speeds up browser network downloads by 50%", explanationIfWrong: "File splitting does not magically double download speeds." },
            { id: "C", text: "It allows the component to access private database passwords", explanationIfWrong: "Client-side components must never contain database passwords." },
            { id: "D", text: "It prevents the component from executing on mobile devices", explanationIfWrong: "Components execute on all devices." }
          ],
          correctAnswer: "A",
          explanationNote: "Separating components into discrete modules maintains code readability, separation of concerns, and clean testing boundaries."
        },
        retestMcq: {
          id: "q-2.1-3-v2",
          question: "When exporting a component with `export default Note`, how is it imported in another file?",
          options: [
            { id: "A", text: "`import Note from './components/Note'` without curly braces", explanationIfWrong: "" },
            { id: "B", text: "`import { Note } from './components/Note'` with curly braces", explanationIfWrong: "Curly braces are for named exports, not default exports." },
            { id: "C", text: "`require.default('./components/Note')`", explanationIfWrong: "ES6 module syntax uses import, not require.default." },
            { id: "D", text: "`<script src='./components/Note.js'>`", explanationIfWrong: "React uses module bundlers, not direct script tags." }
          ],
          correctAnswer: "A",
          explanationNote: "Default exports are imported without curly braces, whereas named exports (`export const Note`) require curly braces."
        }
      },
      {
        heading: "Filtering Displayed Lists",
        text: "You can combine `.filter()` with `.map()` to render a subset of a collection (such as showing only important notes) based on a state toggle.",
        codeSnippet: `const [showAll, setShowAll] = useState(true);\n\nconst notesToShow = showAll\n  ? notes\n  : notes.filter(note => note.important);\n\nreturn (\n  <div>\n    <button onClick={() => setShowAll(!showAll)}>\n      Show {showAll ? 'Important' : 'All'}\n    </button>\n    <ul>\n      {notesToShow.map(note => <li key={note.id}>{note.content}</li>)}\n    </ul>\n  </div>\n);`,
        terminalOutput: `Toggles list between all items and filtered items without reloading`,
        mcq: {
          id: "q-2.1-4-v1",
          question: "In the code above, why is `notesToShow` defined as a local variable rather than stored in a separate `useState` hook?",
          options: [
            { id: "A", text: "`notesToShow` is derived state that can be computed synchronously from `notes` and `showAll` on every render", explanationIfWrong: "" },
            { id: "B", text: "React state cannot hold arrays", explanationIfWrong: "React state can hold any data type." },
            { id: "C", text: "Using useState for filtered lists causes syntax errors", explanationIfWrong: "It's not a syntax error, but an anti-pattern of duplicate state." },
            { id: "D", text: "Filtered lists only exist on the server", explanationIfWrong: "This filtering happens client-side." }
          ],
          correctAnswer: "A",
          explanationNote: "Deriving values during render avoids redundant state variables that could become out of sync with the source data."
        },
        retestMcq: {
          id: "q-2.1-4-v2",
          question: "What does `!showAll` do when toggling state via `setShowAll(!showAll)`?",
          options: [
            { id: "A", text: "It flips boolean `true` to `false` and `false` to `true`", explanationIfWrong: "" },
            { id: "B", text: "It resets the value to null", explanationIfWrong: "Logical NOT flips booleans, it doesn't set null." },
            { id: "C", text: "It deletes the showAll variable from memory", explanationIfWrong: "Logical NOT does not delete variables." },
            { id: "D", text: "It checks if showAll is greater than 0", explanationIfWrong: "Comparison operators check magnitude; ! inverts truthiness." }
          ],
          correctAnswer: "A",
          explanationNote: "The logical NOT operator `!` inverts boolean state, making it the standard pattern for toggling switches and modals."
        }
      },
      {
        heading: "Handling Empty Collections",
        text: "Always provide feedback when a collection is empty so the user is never left staring at a confusing blank screen.",
        codeSnippet: `const NoteList = ({ notes }) => {\n  if (notes.length === 0) {\n    return <p className="text-slate">No notes available. Add your first note below!</p>;\n  }\n\n  return <ul>{notes.map(n => <li key={n.id}>{n.content}</li>)}</ul>;\n};`,
        terminalOutput: `No notes available. Add your first note below!`,
        mcq: {
          id: "q-2.1-5-v1",
          question: "Why is handling empty collections with an early fallback message considered a best practice?",
          options: [
            { id: "A", text: "It ensures a clear user experience rather than displaying an empty, unresponsive whitespace", explanationIfWrong: "" },
            { id: "B", text: "React crashes with a fatal error if an empty array is mapped", explanationIfWrong: "Mapping an empty array is safe and returns []; it just renders nothing." },
            { id: "C", text: "The browser automatically redirects to 404 on empty lists", explanationIfWrong: "Browsers do not redirect for empty JSX arrays." },
            { id: "D", text: "Empty lists disable keyboard inputs", explanationIfWrong: "Inputs remain functional." }
          ],
          correctAnswer: "A",
          explanationNote: "Empty states communicate application status to users, guiding them on what action to take next."
        },
        retestMcq: {
          id: "q-2.1-5-v2",
          question: "What does `[].map(item => item.id)` return in JavaScript?",
          options: [
            { id: "A", text: "An empty array `[]` without throwing any errors", explanationIfWrong: "" },
            { id: "B", text: "null", explanationIfWrong: ".map() always returns an array." },
            { id: "C", text: "undefined", explanationIfWrong: ".map() returns an array, not undefined." },
            { id: "D", text: "A TypeError", explanationIfWrong: "Calling map on an empty array is completely valid." }
          ],
          correctAnswer: "A",
          explanationNote: "Calling `.map()` on an empty array simply returns a new empty array without executing the callback."
        }
      }
    ]
  },
  {
    id: "2-2-forms-controlled-components",
    number: "2.2",
    title: "Controlled Forms & User Input",
    subtitle: "Manage form inputs in React state, handle onSubmit events, and maintain single sources of truth.",
    readTime: "14 min",
    objectives: [
      "Define controlled input components bound to React state",
      "Attach onChange event handlers to sync input value with state",
      "Handle form submissions and prevent default browser page reloads",
      "Clear inputs after successful form submissions",
      "Validate user input before updating state",
      "Differentiate between controlled and uncontrolled components"
    ],
    theoryBlocks: [
      {
        heading: "Controlled Components in React",
        text: "An input element whose value is controlled by React state is called a controlled component. React state serves as the single source of truth.",
        codeSnippet: `const [newNote, setNewNote] = useState('');\n\nconst handleNoteChange = (event) => {\n  setNewNote(event.target.value);\n};\n\nreturn <input value={newNote} onChange={handleNoteChange} />;`,
        terminalOutput: `Input value is strictly synced with the 'newNote' state variable`,
        mcq: {
          id: "q-2.2-0-v1",
          question: "What makes an `<input />` element a 'controlled component' in React?",
          options: [
            { id: "A", text: "Its `value` prop is driven by React state, and its `onChange` handler updates that state", explanationIfWrong: "" },
            { id: "B", text: "It is wrapped inside an HTML `<fieldset disabled>` tag", explanationIfWrong: "Controlled refers to state binding, not disabling." },
            { id: "C", text: "It can only accept password characters", explanationIfWrong: "Controlled components work with all input types." },
            { id: "D", text: "The server directly writes to the user's keyboard buffer", explanationIfWrong: "React state controls the input value." }
          ],
          correctAnswer: "A",
          explanationNote: "In a controlled component, the input's current value is dictated by React state, and user keystrokes update state via `onChange`."
        },
        retestMcq: {
          id: "q-2.2-0-v2",
          question: "What happens if you provide a `value='Hello'` prop to an `<input />` without an `onChange` handler?",
          options: [
            { id: "A", text: "The input becomes read-only because React prevents user typing from changing the rendered value", explanationIfWrong: "" },
            { id: "B", text: "The user can type freely without restrictions", explanationIfWrong: "Without onChange, React re-renders 'Hello' on every keystroke, blocking edits." },
            { id: "C", text: "React deletes the input element from the DOM", explanationIfWrong: "The element remains in the DOM." },
            { id: "D", text: "The browser triggers an infinite alert loop", explanationIfWrong: "No alert is triggered; React logs a console warning in development." }
          ],
          correctAnswer: "A",
          explanationNote: "Setting `value` without `onChange` locks the input, because the DOM element is forced to match the static state value."
        }
      },
      {
        heading: "Handling Form Submissions (`event.preventDefault()`)",
        text: "Form submissions trigger an `onSubmit` event. Always call `event.preventDefault()` to stop the browser from reloading the page.",
        codeSnippet: `const addNote = (event) => {\n  event.preventDefault(); // Stop page refresh\n  const noteObject = {\n    id: String(notes.length + 1),\n    content: newNote,\n    important: Math.random() < 0.5\n  };\n  setNotes(notes.concat(noteObject));\n  setNewNote(''); // Reset input field\n};`,
        terminalOutput: `Note added to state; input cleared; no page reload`,
        mcq: {
          id: "q-2.2-1-v1",
          question: "Why must `event.preventDefault()` be called in a form's `onSubmit` handler in a React app?",
          options: [
            { id: "A", text: "To prevent the browser's default action of submitting an HTTP request and refreshing the page", explanationIfWrong: "" },
            { id: "B", text: "To encrypt the form data before storing in local state", explanationIfWrong: "preventDefault does not perform encryption." },
            { id: "C", text: "To enable HTML5 CSS validations", explanationIfWrong: "HTML5 validation occurs before onSubmit." },
            { id: "D", text: "To clear the computer's RAM memory", explanationIfWrong: "preventDefault controls event propagation and default actions." }
          ],
          correctAnswer: "A",
          explanationNote: "Native HTML forms submit by reloading the entire page. Calling `preventDefault()` lets React JavaScript handle the submission in-memory."
        },
        retestMcq: {
          id: "q-2.2-1-v2",
          question: "Where should the submit handler be attached in JSX?",
          options: [
            { id: "A", text: "`<form onSubmit={addNote}>` on the form element itself", explanationIfWrong: "" },
            { id: "B", text: "Only on the button with `onClick` and not on the form", explanationIfWrong: "Attaching to `<form onSubmit>` supports both button clicks and pressing Enter." },
            { id: "C", text: "In the window.onload callback", explanationIfWrong: "React uses component-level event props." },
            { id: "D", text: "Inside the `<head>` tag", explanationIfWrong: "Event handlers attach to elements in the body." }
          ],
          correctAnswer: "A",
          explanationNote: "Attaching `onSubmit` to the `<form>` ensures submission works when clicking the submit button AND when pressing Enter in an input."
        }
      },
      {
        heading: "Clearing Inputs After Submission",
        text: "In controlled components, resetting the input field after a successful form submission is as simple as calling its state setter with an empty string.",
        codeSnippet: `const addNote = (event) => {\n  event.preventDefault();\n  // ... create and save note ...\n  setNewNote(''); // Clears the input field immediately\n};`,
        terminalOutput: `Input value resets to '' automatically because value={newNote}`,
        mcq: {
          id: "q-2.2-2-v1",
          question: "How do you clear a controlled text input after the user submits the form?",
          options: [
            { id: "A", text: "Set the bound state variable to an empty string: `setNewNote('')`", explanationIfWrong: "" },
            { id: "B", text: "Call `document.getElementById('input').value = ''`", explanationIfWrong: "Direct DOM manipulation violates React's single source of truth." },
            { id: "C", text: "Unmount and remount the entire React application", explanationIfWrong: "Remounting the entire app destroys all other state." },
            { id: "D", text: "Restart the Vite development server", explanationIfWrong: "Development servers are for bundling, not clearing user inputs." }
          ],
          correctAnswer: "A",
          explanationNote: "Because the input's `value` is tied to `newNote`, updating `setNewNote('')` causes React to re-render the input with an empty value."
        },
        retestMcq: {
          id: "q-2.2-2-v2",
          question: "What is an 'uncontrolled component' in React?",
          options: [
            { id: "A", text: "An input where form data is handled directly by the DOM itself (accessed via a `ref`) rather than React state", explanationIfWrong: "" },
            { id: "B", text: "A component that crashes whenever clicked", explanationIfWrong: "Uncontrolled is a valid React pattern using DOM refs." },
            { id: "C", text: "A component with more than 100 props", explanationIfWrong: "The number of props does not define controlled vs uncontrolled." },
            { id: "D", text: "A server-side Node.js script", explanationIfWrong: "It refers to client-side input handling." }
          ],
          correctAnswer: "A",
          explanationNote: "Uncontrolled components pull values directly from the DOM using refs (`ref.current.value`) rather than binding to React state."
        }
      },
      {
        heading: "Preventing Empty or Duplicate Submissions",
        text: "Always validate user input before saving to state. Trim whitespace and check for duplicates to prevent empty entries.",
        codeSnippet: `const addNote = (event) => {\n  event.preventDefault();\n  if (newNote.trim() === '') return;\n\n  const isDuplicate = notes.some(n => n.content.toLowerCase() === newNote.toLowerCase());\n  if (isDuplicate) {\n    alert(\`\${newNote} is already in the list!\`);\n    return;\n  }\n  // Save note...\n};`,
        terminalOutput: `Guards against blank lines and duplicate entries`,
        mcq: {
          id: "q-2.2-3-v1",
          question: "What does `string.trim()` do when validating user input?",
          options: [
            { id: "A", text: "It strips whitespace characters from both the beginning and end of the string", explanationIfWrong: "" },
            { id: "B", text: "It cuts the string length in half", explanationIfWrong: "trim removes whitespace, not arbitrary characters." },
            { id: "C", text: "It converts text to uppercase", explanationIfWrong: "toUpperCase handles casing." },
            { id: "D", text: "It removes all vowels from the text", explanationIfWrong: "trim only affects leading and trailing whitespace." }
          ],
          correctAnswer: "A",
          explanationNote: "`.trim()` ensures that inputs containing only spacebars or tabs are caught and rejected as empty."
        },
        retestMcq: {
          id: "q-2.2-3-v2",
          question: "Which Array method cleanly tests if at least one item matches a duplicate condition?",
          options: [
            { id: "A", text: "`Array.prototype.some()`", explanationIfWrong: "" },
            { id: "B", text: "`Array.prototype.pop()`", explanationIfWrong: "pop removes the last element." },
            { id: "C", text: "`Array.prototype.push()`", explanationIfWrong: "push appends an element." },
            { id: "D", text: "`Array.prototype.shift()`", explanationIfWrong: "shift removes the first element." }
          ],
          correctAnswer: "A",
          explanationNote: "`.some()` returns a boolean indicating whether at least one element in the array passes the test."
        }
      },
      {
        heading: "Managing Multiple Form Inputs",
        text: "For forms with multiple fields (e.g. name and phone number), maintain separate state variables or combine them into a state object.",
        codeSnippet: `const [newName, setNewName] = useState('');\nconst [newNumber, setNewNumber] = useState('');\n\nreturn (\n  <form onSubmit={handleSubmit}>\n    <input value={newName} onChange={e => setNewName(e.target.value)} />\n    <input value={newNumber} onChange={e => setNewNumber(e.target.value)} />\n    <button type="submit">Add Contact</button>\n  </form>\n);`,
        terminalOutput: `Phonebook pattern: Clean, discrete state per input field`,
        mcq: {
          id: "q-2.2-4-v1",
          question: "In the Helsinki Phonebook exercise with name and number fields, why is using two separate `useState` hooks recommended?",
          options: [
            { id: "A", text: "It provides simple, independent handlers without needing to spread complex object properties", explanationIfWrong: "" },
            { id: "B", text: "React cannot store more than one value in an object", explanationIfWrong: "Objects can store unlimited properties in state." },
            { id: "C", text: "Browser input fields cannot share state", explanationIfWrong: "Inputs can easily share a state object." },
            { id: "D", text: "It prevents phone numbers from containing digits", explanationIfWrong: "State hooks do not restrict data types." }
          ],
          correctAnswer: "A",
          explanationNote: "Keeping inputs in separate `useState` hooks avoids manual object spread boilerplate and keeps change handlers clean."
        },
        retestMcq: {
          id: "q-2.2-4-v2",
          question: "If using a single object state `const [form, setForm] = useState({ name: '', phone: '' })`, how do you update `phone`?",
          options: [
            { id: "A", text: "`setForm({ ...form, phone: e.target.value })`", explanationIfWrong: "" },
            { id: "B", text: "`setForm({ phone: e.target.value })`", explanationIfWrong: "This will delete the 'name' field from state." },
            { id: "C", text: "`form.phone = e.target.value`", explanationIfWrong: "Direct state mutation violates React immutability." },
            { id: "D", text: "`setForm.phone(e.target.value)`", explanationIfWrong: "setForm is a function, not an object with methods." }
          ],
          correctAnswer: "A",
          explanationNote: "When updating an object in state, always spread `{ ...form }` first so existing properties are not overwritten and lost."
        }
      },
      {
        heading: "Filtering Search Inputs in Real-Time",
        text: "A search filter input can update a query state on every keystroke, immediately filtering the list shown to the user.",
        codeSnippet: `const [filterQuery, setFilterQuery] = useState('');\n\nconst filteredPersons = persons.filter(person =>\n  person.name.toLowerCase().includes(filterQuery.toLowerCase())\n);`,
        terminalOutput: `Instant filtering as user types without any server requests`,
        mcq: {
          id: "q-2.2-5-v1",
          question: "Why should `toLowerCase()` be used on both the person's name and the filter query?",
          options: [
            { id: "A", text: "To perform a case-insensitive search matching regardless of whether the user types uppercase or lowercase", explanationIfWrong: "" },
            { id: "B", text: "Because JavaScript string comparison fails on capital letters", explanationIfWrong: "Comparison works, but 'Alex' !== 'alex'." },
            { id: "C", text: "To compress string size in browser memory", explanationIfWrong: "toLowerCase does not compress memory." },
            { id: "D", text: "To translate strings into Latin characters", explanationIfWrong: "toLowerCase only changes letter case." }
          ],
          correctAnswer: "A",
          explanationNote: "Converting both the target text and query to lowercase ensures that searches match regardless of letter capitalization."
        },
        retestMcq: {
          id: "q-2.2-5-v2",
          question: "Does real-time client-side list filtering modify the underlying data array?",
          options: [
            { id: "A", text: "No, `.filter()` returns a new array for display; the source state array remains complete and intact", explanationIfWrong: "" },
            { id: "B", text: "Yes, it permanently deletes non-matching records from memory", explanationIfWrong: "filter never mutates the original array." },
            { id: "C", text: "Only if the user presses backspace", explanationIfWrong: "Original state remains intact regardless of typing." },
            { id: "D", text: "Only in production builds", explanationIfWrong: "JavaScript array methods behave identically across all environments." }
          ],
          correctAnswer: "A",
          explanationNote: "Client-side filtering produces a temporary display view without destroying the master list stored in state."
        }
      }
    ]
  },
  {
    id: "2-3-axios-useeffect-data-fetching",
    number: "2.3",
    title: "Fetching Data with Axios & useEffect",
    subtitle: "Install Axios, execute asynchronous GET requests, manage side effects with useEffect, and handle component lifecycles.",
    readTime: "15 min",
    objectives: [
      "Use Axios to fetch JSON data over HTTP GET requests",
      "Understand JavaScript Promises and .then() callback chains",
      "Execute side effects using React's useEffect hook",
      "Understand the dependency array `[]` and prevent infinite fetch loops",
      "Store fetched remote data into local component state",
      "Inspect network requests and responses in Browser Developer Tools"
    ],
    theoryBlocks: [
      {
        heading: "HTTP GET Requests with Axios",
        text: "Axios is a lightweight HTTP client for the browser. `axios.get(url)` returns a Promise that resolves with a response object containing `data`.",
        codeSnippet: `import axios from 'axios';\n\naxios.get('http://localhost:3001/notes').then(response => {\n  const notes = response.data;\n  console.log('Fetched notes:', notes);\n});`,
        terminalOutput: `response.data: [{ id: 1, content: 'HTML is easy' }, ...]`,
        mcq: {
          id: "q-2.3-0-v1",
          question: "What does calling `axios.get(url)` return immediately?",
          options: [
            { id: "A", text: "A Promise representing the eventual completion or failure of the asynchronous HTTP request", explanationIfWrong: "" },
            { id: "B", text: "The actual JSON payload data synchronously", explanationIfWrong: "Network requests are asynchronous; data is not available immediately on the same line." },
            { id: "C", text: "A raw DOM node", explanationIfWrong: "Axios handles HTTP communication, not DOM nodes." },
            { id: "D", text: "A boolean true", explanationIfWrong: "Axios returns a Promise object." }
          ],
          correctAnswer: "A",
          explanationNote: "Network calls take time. `axios.get` returns a Promise that resolves when the server responds."
        },
        retestMcq: {
          id: "q-2.3-0-v2",
          question: "Where is the parsed server JSON response payload located in the Axios response object?",
          options: [
            { id: "A", text: "In `response.data`", explanationIfWrong: "" },
            { id: "B", text: "In `response.body.json`", explanationIfWrong: "The Fetch API uses .json(); Axios parses automatically into .data." },
            { id: "C", text: "In `response.headers.payload`", explanationIfWrong: "Headers contain metadata like Content-Type." },
            { id: "D", text: "In `response.text`", explanationIfWrong: "Axios automatically parses JSON into response.data." }
          ],
          correctAnswer: "A",
          explanationNote: "Unlike native `fetch` which requires calling `.json()`, Axios automatically deserializes JSON into `response.data`."
        }
      },
      {
        heading: "The `useEffect` Hook for Side Effects",
        text: "The `useEffect` hook lets you perform side effects (like data fetching, timers, or DOM subscriptions) after React has rendered the component.",
        codeSnippet: `import { useState, useEffect } from 'react';\nimport axios from 'axios';\n\nconst App = () => {\n  const [notes, setNotes] = useState([]);\n\n  useEffect(() => {\n    axios.get('http://localhost:3001/notes').then(response => {\n      setNotes(response.data);\n    });\n  }, []); // Empty array: runs ONCE after initial render\n};`,
        terminalOutput: `Component mounts -> renders empty -> useEffect fetches -> setNotes updates UI`,
        mcq: {
          id: "q-2.3-1-v1",
          question: "What is the primary purpose of the `useEffect` hook in React functional components?",
          options: [
            { id: "A", text: "To execute side effects such as data fetching, subscriptions, or manually updating the DOM after rendering", explanationIfWrong: "" },
            { id: "B", text: "To define CSS style animations", explanationIfWrong: "CSS handles animations; useEffect runs JavaScript side effects." },
            { id: "C", text: "To encrypt passwords before saving to the database", explanationIfWrong: "Encryption is done on the backend." },
            { id: "D", text: "To convert React components into Angular components", explanationIfWrong: "useEffect is a core React lifecycle hook." }
          ],
          correctAnswer: "A",
          explanationNote: "`useEffect` tells React that your component needs to do something after render, such as requesting data from a backend server."
        },
        retestMcq: {
          id: "q-2.3-1-v2",
          question: "When does the callback inside `useEffect(() => { ... }, [])` execute?",
          options: [
            { id: "A", text: "After the component's initial render has been committed to the screen", explanationIfWrong: "" },
            { id: "B", text: "Before the component function is even loaded by the bundler", explanationIfWrong: "Hooks execute when the component is mounted." },
            { id: "C", text: "Continuously 60 times per second", explanationIfWrong: "It runs once on mount when the dependency array is empty." },
            { id: "D", text: "Only when the browser window closes", explanationIfWrong: "It runs when the component mounts." }
          ],
          correctAnswer: "A",
          explanationNote: "By default, effects run after the initial render finishes, ensuring UI is on screen before background fetching starts."
        }
      },
      {
        heading: "The Dependency Array (`[]`) & Preventing Infinite Loops",
        text: "Passing an empty dependency array `[]` ensures the effect runs only once when the component mounts. Omitting the array causes an infinite fetching loop.",
        codeSnippet: `// ❌ DISASTER: Runs on EVERY render; setNotes triggers re-render = infinite fetch loop!\nuseEffect(() => {\n  axios.get('/notes').then(res => setNotes(res.data));\n});\n\n// ✅ SAFE: Empty array [] specifies effect runs ONCE on mount\nuseEffect(() => {\n  axios.get('/notes').then(res => setNotes(res.data));\n}, []);`,
        terminalOutput: `Warning if omitted: Hundreds of GET requests spam server per second`,
        mcq: {
          id: "q-2.3-2-v1",
          question: "What catastrophic bug happens if you omit the second argument `[]` in `useEffect` when fetching data?",
          options: [
            { id: "A", text: "An infinite loop: fetching data updates state, which triggers a re-render, which runs the effect again endlessly", explanationIfWrong: "" },
            { id: "B", text: "The network cable physically disconnects", explanationIfWrong: "No hardware effect; it floods the network with HTTP requests." },
            { id: "C", text: "React converts all numbers into strings", explanationIfWrong: "No type conversion occurs." },
            { id: "D", text: "The browser deletes the operating system", explanationIfWrong: "It just locks up the browser tab from network spam." }
          ],
          correctAnswer: "A",
          explanationNote: "Without dependencies, `useEffect` runs after EVERY render. Since `setNotes` causes a render, an infinite HTTP request loop is created."
        },
        retestMcq: {
          id: "q-2.3-2-v2",
          question: "What does an empty dependency array `[]` communicate to React?",
          options: [
            { id: "A", text: "The effect does not depend on any props or state and should only run once when the component mounts", explanationIfWrong: "" },
            { id: "B", text: "The effect should never execute at all", explanationIfWrong: "An empty array runs once on mount, not never." },
            { id: "C", text: "The effect should run in reverse", explanationIfWrong: "Effects have no reverse execution." },
            { id: "D", text: "The component should not render HTML", explanationIfWrong: "Rendering occurs normally." }
          ],
          correctAnswer: "A",
          explanationNote: "Passing `[]` tells React that the effect has zero reactive dependencies, so it should run exactly once after mount."
        }
      },
      {
        heading: "Promises: States & Async Handling",
        text: "A Promise is an object representing an asynchronous operation. It has three states: `pending` (in progress), `fulfilled` (succeeded), or `rejected` (failed).",
        codeSnippet: `// Pending -> Fulfilled or Rejected\nconst promise = axios.get('http://localhost:3001/notes');\nconsole.log(promise); // Promise { <pending> }\n\npromise\n  .then(response => console.log('Fulfilled:', response.data))\n  .catch(error => console.error('Rejected:', error.message));`,
        terminalOutput: `Promise { <pending> } -> Fulfilled: 200 OK`,
        mcq: {
          id: "q-2.3-3-v1",
          question: "What are the three possible lifecycle states of a JavaScript Promise?",
          options: [
            { id: "A", text: "Pending, Fulfilled (Resolved), and Rejected", explanationIfWrong: "" },
            { id: "B", text: "Started, Paused, and Finished", explanationIfWrong: "These are not standard Promise states." },
            { id: "C", text: "Draft, Review, and Published", explanationIfWrong: "These are publishing states." },
            { id: "D", text: "Synchronous, Asynchronous, and Multi-threaded", explanationIfWrong: "These are execution models." }
          ],
          correctAnswer: "A",
          explanationNote: "A Promise begins in the `pending` state, then settles into either `fulfilled` (via `.then()`) or `rejected` (via `.catch()`)."
        },
        retestMcq: {
          id: "q-2.3-3-v2",
          question: "How do you handle an HTTP network error (such as a 404 or server crash) when using Axios Promises?",
          options: [
            { id: "A", text: "Chain a `.catch(error => { ... })` handler at the end of the promise chain", explanationIfWrong: "" },
            { id: "B", text: "Wrap the import statement in an if statement", explanationIfWrong: "Imports cannot be conditionally wrapped in ES6." },
            { id: "C", text: "Write `window.onerror = true`", explanationIfWrong: "window.onerror is a legacy global error trap." },
            { id: "D", text: "Change the URL to http://localhost:8080", explanationIfWrong: "Changing URLs does not handle errors programmatically." }
          ],
          correctAnswer: "A",
          explanationNote: "Calling `.catch()` captures any rejection or HTTP error (4xx/5xx) in the promise chain, preventing unhandled exceptions."
        }
      },
      {
        heading: "Conditional Loading Spinners",
        text: "Because network fetching is asynchronous, initial state is empty or null. Show a loading indicator until the server data arrives.",
        codeSnippet: `const [notes, setNotes] = useState(null);\n\nuseEffect(() => {\n  axios.get('/notes').then(res => setNotes(res.data));\n}, []);\n\nif (!notes) {\n  return <div className="p-4 text-primary">Loading notes from server...</div>;\n}\n\nreturn <ul>{notes.map(n => <li key={n.id}>{n.content}</li>)}</ul>;`,
        terminalOutput: `Loading notes from server... -> (150ms later) -> [Notes list appears]`,
        mcq: {
          id: "q-2.3-4-v1",
          question: "Why does `if (!notes) return <Loading />` prevent `TypeError: Cannot read properties of null`?",
          options: [
            { id: "A", text: "It prevents React from trying to map over `notes` before the asynchronous network request has finished populating state", explanationIfWrong: "" },
            { id: "B", text: "It cancels the server request if it takes longer than 1 second", explanationIfWrong: "It does not cancel requests; it guards rendering." },
            { id: "C", text: "It forces Axios to execute synchronously", explanationIfWrong: "Axios is always asynchronous." },
            { id: "D", text: "It deletes null from JavaScript", explanationIfWrong: "null remains part of the language." }
          ],
          correctAnswer: "A",
          explanationNote: "Guarding with an early return handles the initial `null` state safely while waiting for the network response to resolve."
        },
        retestMcq: {
          id: "q-2.3-4-v2",
          question: "If initial state is `useState([])` (empty array), does `notes.map()` crash on the initial render?",
          options: [
            { id: "A", text: "No, mapping an empty array `[]` safely evaluates to `[]` and renders an empty list without crashing", explanationIfWrong: "" },
            { id: "B", text: "Yes, mapping any array without items throws a RangeError", explanationIfWrong: "Mapping an empty array is completely safe in JavaScript." },
            { id: "C", text: "Yes, React requires at least one element to render a `<ul>`", explanationIfWrong: "Empty uls are completely valid HTML." },
            { id: "D", text: "Only in Google Chrome", explanationIfWrong: "JavaScript standard behavior is consistent across all browsers." }
          ],
          correctAnswer: "A",
          explanationNote: "Initializing state with `[]` avoids `null` pointer exceptions because `.map()` on an empty array simply returns an empty list."
        }
      },
      {
        heading: "json-server: Local Mock Backend",
        text: "During development, `json-server` provides a fast, full mock REST API from a simple `db.json` file on port 3001.",
        codeSnippet: `// db.json:\n{\n  "notes": [\n    { "id": "1", "content": "HTML is easy", "important": true },\n    { "id": "2", "content": "GET and POST are HTTP methods", "important": false }\n  ]\n}\n\n// Run in terminal: npx json-server --port 3001 --watch db.json`,
        terminalOutput: `Resources: http://localhost:3001/notes\nHome: http://localhost:3001`,
        mcq: {
          id: "q-2.3-5-v1",
          question: "What role does `json-server` play in Helsinki Full Stack Open Part 2 exercises?",
          options: [
            { id: "A", text: "It acts as a lightweight mock backend REST API serving and persisting data to a local `db.json` file", explanationIfWrong: "" },
            { id: "B", text: "It replaces the React front-end entirely", explanationIfWrong: "json-server is a backend mock server." },
            { id: "C", text: "It is a production database for millions of users", explanationIfWrong: "json-server is strictly a development mock tool." },
            { id: "D", text: "It compiles JSX into native machine code", explanationIfWrong: "json-server serves HTTP requests." }
          ],
          correctAnswer: "A",
          explanationNote: "`json-server` lets developers practice real HTTP GET, POST, PUT, and DELETE operations before building their own Express backend in Part 3."
        },
        retestMcq: {
          id: "q-2.3-5-v2",
          question: "When running Vite on port 5173 and json-server on port 3001, how do they interact?",
          options: [
            { id: "A", text: "The React app on port 5173 sends asynchronous HTTP requests over TCP/IP to json-server on port 3001", explanationIfWrong: "" },
            { id: "B", text: "Port 3001 controls the mouse cursor on port 5173", explanationIfWrong: "Ports communicate via standard network protocols." },
            { id: "C", text: "Both applications merge into a single process in RAM", explanationIfWrong: "They run as two independent processes." },
            { id: "D", text: "They share the same CSS style definitions", explanationIfWrong: "Backend json-server has no CSS." }
          ],
          correctAnswer: "A",
          explanationNote: "The frontend React client runs in the browser and sends standard HTTP requests to the backend server running on port 3001."
        }
      }
    ]
  },
  {
    id: "2-4-altering-server-data-rest",
    number: "2.4",
    title: "Altering Server Data with REST APIs",
    subtitle: "Create, update, and delete server resources using HTTP POST, PUT, PATCH, and DELETE with Axios.",
    readTime: "15 min",
    objectives: [
      "Create new resources on the server using `axios.post()`",
      "Update existing resources using `axios.put()` and `axios.patch()`",
      "Delete server resources using `axios.delete()`",
      "Understand REST conventions and URI structure (`/api/notes/:id`)",
      "Synchronize local React state with server response data",
      "Confirm destructive actions using browser dialogs"
    ],
    theoryBlocks: [
      {
        heading: "Creating Resources with HTTP POST",
        text: "To save new data to the server, send an HTTP POST request with the new object payload. The server returns the created object with its assigned ID.",
        codeSnippet: `const newNoteObject = {\n  content: newNote,\n  important: true\n};\n\naxios\n  .post('http://localhost:3001/notes', newNoteObject)\n  .then(response => {\n    // response.data includes the newly generated id\n    setNotes(notes.concat(response.data));\n    setNewNote('');\n  });`,
        terminalOutput: `POST /notes 201 Created -> { id: "3", content: "Learn React", important: true }`,
        mcq: {
          id: "q-2.4-0-v1",
          question: "When creating a new resource with `axios.post(url, newObject)`, what does the server typically return on success?",
          options: [
            { id: "A", text: "HTTP status 201 Created and the created resource object including its server-generated ID", explanationIfWrong: "" },
            { id: "B", text: "A copy of the entire database", explanationIfWrong: "REST endpoints only return the created record." },
            { id: "C", text: "An empty string with status 204", explanationIfWrong: "204 No Content is common for DELETE, not POST creation." },
            { id: "D", text: "A HTML error page", explanationIfWrong: "Successful creation returns status 201." }
          ],
          correctAnswer: "A",
          explanationNote: "REST conventions mandate returning HTTP 201 Created along with the newly created resource in the response body."
        },
        retestMcq: {
          id: "q-2.4-0-v2",
          question: "Why should `setNotes(notes.concat(response.data))` use `response.data` rather than the client-side `newNoteObject`?",
          options: [
            { id: "A", text: "Because `response.data` contains the canonical server-generated properties like `id` and timestamps", explanationIfWrong: "" },
            { id: "B", text: "Because client objects are deleted by Axios after transmission", explanationIfWrong: "Client objects remain in memory." },
            { id: "C", text: "Because React state rejects objects not created by Axios", explanationIfWrong: "React state accepts any valid JavaScript object." },
            { id: "D", text: "To compress the memory footprint", explanationIfWrong: "Data integrity and ID synchronization is the reason." }
          ],
          correctAnswer: "A",
          explanationNote: "Using the server response guarantees that client state is in exact sync with backend IDs and server-side defaults."
        }
      },
      {
        heading: "Updating Resources: HTTP PUT vs PATCH",
        text: "HTTP PUT replaces the entire target resource with a new version. HTTP PATCH updates only the specific modified fields.",
        codeSnippet: `const toggleImportanceOf = (id) => {\n  const note = notes.find(n => n.id === id);\n  const changedNote = { ...note, important: !note.important };\n\n  axios\n    .put(\`http://localhost:3001/notes/\${id}\`, changedNote)\n    .then(response => {\n      setNotes(notes.map(n => n.id !== id ? n : response.data));\n    });\n};`,
        terminalOutput: `PUT /notes/2 200 OK -> Updated note with flipped important flag`,
        mcq: {
          id: "q-2.4-1-v1",
          question: "In the `toggleImportanceOf` function above, what does `notes.map(n => n.id !== id ? n : response.data)` do?",
          options: [
            { id: "A", text: "It creates a new array replacing the modified note with the server response while keeping all other notes unchanged", explanationIfWrong: "" },
            { id: "B", text: "It deletes every note whose id does not match", explanationIfWrong: "Ternary operator keeps unchanged notes as 'n'." },
            { id: "C", text: "It converts all notes to uppercase", explanationIfWrong: "No string formatting occurs." },
            { id: "D", text: "It reverses the list order", explanationIfWrong: "Map preserves original list order." }
          ],
          correctAnswer: "A",
          explanationNote: "Mapping with a conditional replacement is the canonical React pattern for immutably updating a single item in a state array."
        },
        retestMcq: {
          id: "q-2.4-1-v2",
          question: "What is the key difference between HTTP PUT and HTTP PATCH?",
          options: [
            { id: "A", text: "PUT replaces the complete resource; PATCH updates only the specific properties sent in the request", explanationIfWrong: "" },
            { id: "B", text: "PUT is asynchronous, while PATCH is synchronous", explanationIfWrong: "Both are asynchronous HTTP methods." },
            { id: "C", text: "PATCH is only supported on mobile devices", explanationIfWrong: "Both are standard HTTP verbs supported everywhere." },
            { id: "D", text: "PUT deletes the database on success", explanationIfWrong: "DELETE deletes resources, not PUT." }
          ],
          correctAnswer: "A",
          explanationNote: "According to HTTP specifications, PUT represents full resource replacement, whereas PATCH applies partial modifications."
        }
      },
      {
        heading: "Deleting Resources with HTTP DELETE",
        text: "HTTP DELETE removes a resource from the server using its unique URI (`/notes/:id`). Confirm with the user before performing destructive deletions.",
        codeSnippet: `const deleteNote = (id) => {\n  if (window.confirm('Are you sure you want to delete this note?')) {\n    axios\n      .delete(\`http://localhost:3001/notes/\${id}\`)\n      .then(() => {\n        setNotes(notes.filter(n => n.id !== id));\n      });\n  }\n};`,
        terminalOutput: `DELETE /notes/2 204 No Content -> Filtered out of local state array`,
        mcq: {
          id: "q-2.4-2-v1",
          question: "How do you update React state after successfully deleting an item on the server?",
          options: [
            { id: "A", text: "`setNotes(notes.filter(n => n.id !== id))`", explanationIfWrong: "" },
            { id: "B", text: "`notes.splice(id, 1)`", explanationIfWrong: "splice mutates state in-place, which violates React immutability." },
            { id: "C", text: "`delete notes[id]`", explanationIfWrong: "delete operator leaves holes in arrays and does not trigger re-render." },
            { id: "D", text: "`notes.pop()`", explanationIfWrong: "pop removes only the last element." }
          ],
          correctAnswer: "A",
          explanationNote: "`.filter(n => n.id !== id)` returns a brand-new array excluding the deleted item, triggering a clean re-render."
        },
        retestMcq: {
          id: "q-2.4-2-v2",
          question: "What does `window.confirm(message)` return in JavaScript?",
          options: [
            { id: "A", text: "A boolean: `true` if the user clicked OK, `false` if they clicked Cancel", explanationIfWrong: "" },
            { id: "B", text: "The user's typed password", explanationIfWrong: "window.prompt() returns text; confirm returns boolean." },
            { id: "C", text: "A Promise", explanationIfWrong: "window.confirm() is a synchronous modal dialog." },
            { id: "D", text: "undefined", explanationIfWrong: "It returns a boolean." }
          ],
          correctAnswer: "A",
          explanationNote: "`window.confirm()` shows a native modal dialog with OK/Cancel buttons and returns `true` or `false` synchronously."
        }
      },
      {
        heading: "Handling 404 Not Found & Deleted Resources",
        text: "If a user attempts to update a resource that was already deleted on the server, catch the 404 error, notify the user, and remove it from state.",
        codeSnippet: `axios\n  .put(\`/notes/\${id}\`, changedNote)\n  .then(res => setNotes(notes.map(n => n.id !== id ? n : res.data)))\n  .catch(error => {\n    alert(\`The note '\${note.content}' was already deleted from the server\`);\n    setNotes(notes.filter(n => n.id !== id));\n  });`,
        terminalOutput: `Catch 404 -> Alert user -> Clean up stale local state`,
        mcq: {
          id: "q-2.4-3-v1",
          question: "What should your application do if an update request fails with a 404 Not Found status code?",
          options: [
            { id: "A", text: "Inform the user that the item no longer exists on the server and remove it from local state", explanationIfWrong: "" },
            { id: "B", text: "Crash the application immediately", explanationIfWrong: "Apps should handle errors gracefully." },
            { id: "C", text: "Attempt the PUT request in a while(true) loop", explanationIfWrong: "Looping on 404 will spam the server endlessly." },
            { id: "D", text: "Delete all user data from localStorage", explanationIfWrong: "Local storage should not be wiped for a single 404." }
          ],
          correctAnswer: "A",
          explanationNote: "Graceful error recovery informs the user of the conflict and cleans stale entries out of local state."
        },
        retestMcq: {
          id: "q-2.4-3-v2",
          question: "Where can you inspect the HTTP status code (e.g. 404 or 500) of an Axios error in `.catch(error => ...)`?",
          options: [
            { id: "A", text: "`error.response.status`", explanationIfWrong: "" },
            { id: "B", text: "`error.statusCode`", explanationIfWrong: "Axios places HTTP details under error.response." },
            { id: "C", text: "`window.status`", explanationIfWrong: "window.status is an unrelated browser property." },
            { id: "D", text: "`error.json.code`", explanationIfWrong: "Axios provides error.response.status." }
          ],
          correctAnswer: "A",
          explanationNote: "Axios encapsulates HTTP error responses under `error.response`, where `error.response.status` contains the numerical status code."
        }
      },
      {
        heading: "REST API Endpoint Conventions",
        text: "REST APIs use predictable URLs and HTTP verbs: GET `/api/notes` (read all), POST `/api/notes` (create), PUT `/api/notes/:id` (replace), DELETE `/api/notes/:id` (remove).",
        codeSnippet: `// Standard RESTful routes:\nGET    /api/notes      -> fetch list\nGET    /api/notes/123  -> fetch single item\nPOST   /api/notes      -> create item\nPUT    /api/notes/123  -> replace item\nDELETE /api/notes/123  -> remove item`,
        terminalOutput: `Predictable, standardized CRUD API architecture`,
        mcq: {
          id: "q-2.4-4-v1",
          question: "According to REST conventions, what is the appropriate HTTP method and URL to fetch a single note with ID 5?",
          options: [
            { id: "A", text: "GET `/api/notes/5`", explanationIfWrong: "" },
            { id: "B", text: "POST `/api/getNote?id=5`", explanationIfWrong: "GET is used for reading, not POST." },
            { id: "C", text: "DELETE `/api/notes?id=5`", explanationIfWrong: "DELETE is for deletion, not fetching." },
            { id: "D", text: "PUT `/api/fetch/5`", explanationIfWrong: "PUT is for updating." }
          ],
          correctAnswer: "A",
          explanationNote: "REST maps CRUD operations to HTTP methods: GET retrieves a resource by its path identifier `/api/notes/:id`."
        },
        retestMcq: {
          id: "q-2.4-4-v2",
          question: "Which HTTP status code signifies that a server request succeeded and returned no content body (typical for DELETE operations)?",
          options: [
            { id: "A", text: "204 No Content", explanationIfWrong: "" },
            { id: "B", text: "200 OK", explanationIfWrong: "200 typically includes a response body." },
            { id: "C", text: "403 Forbidden", explanationIfWrong: "403 indicates authentication/authorization failure." },
            { id: "D", text: "502 Bad Gateway", explanationIfWrong: "502 is a server proxy error." }
          ],
          correctAnswer: "A",
          explanationNote: "HTTP status 204 No Content confirms that the action succeeded and no content needs to be returned in the response."
        }
      },
      {
        heading: "Optimistic vs Pessimistic UI Updates",
        text: "Pessimistic UI waits for the server response before updating state (safe & accurate). Optimistic UI updates state immediately and rolls back if the server fails.",
        codeSnippet: `// Pessimistic (Standard in Part 2):\naxios.post('/notes', newObj).then(res => {\n  setNotes(notes.concat(res.data)); // Only update after server confirms\n});`,
        terminalOutput: `Guarantees client and server remain perfectly synchronized`,
        mcq: {
          id: "q-2.4-5-v1",
          question: "What is a pessimistic UI update in web applications?",
          options: [
            { id: "A", text: "Waiting for the backend server to confirm success before updating the local UI state", explanationIfWrong: "" },
            { id: "B", text: "Showing error dialogs on every click", explanationIfWrong: "Pessimistic refers to waiting for verification, not negative behavior." },
            { id: "C", text: "Updating state before sending the network request", explanationIfWrong: "Updating state before server response is optimistic UI." },
            { id: "D", text: "Disabling all buttons permanently", explanationIfWrong: "Buttons are re-enabled after response." }
          ],
          correctAnswer: "A",
          explanationNote: "Pessimistic updating waits for the server to reply successfully with the saved record before reflecting the change in the UI."
        },
        retestMcq: {
          id: "q-2.4-5-v2",
          question: "What is the advantage of pessimistic UI updates in financial or data-critical systems?",
          options: [
            { id: "A", text: "It prevents showing confirmation for operations that might fail or get rejected by the server", explanationIfWrong: "" },
            { id: "B", text: "It makes network packets travel faster", explanationIfWrong: "Network speed is unchanged." },
            { id: "C", text: "It eliminates the need for database backups", explanationIfWrong: "Backups are always necessary." },
            { id: "D", text: "It encrypts frontend CSS files", explanationIfWrong: "CSS is not encrypted." }
          ],
          correctAnswer: "A",
          explanationNote: "Pessimistic updates guarantee that the user never sees a false success if the server rejects the transaction."
        }
      }
    ]
  },
  {
    id: "2-5-extracting-backend-services",
    number: "2.5",
    title: "Extracting Modules & Backend Services",
    subtitle: "Separate API communication into dedicated service modules, chain promises cleanly, and decouple UI from network transport.",
    readTime: "14 min",
    objectives: [
      "Create dedicated backend service modules (e.g. `services/notes.js`)",
      "Return raw `response.data` promises from service functions",
      "Decouple React UI components from Axios library details",
      "Maintain clean asynchronous Promise chains",
      "Centralize base API URL configuration",
      "Improve code maintainability and testability"
    ],
    theoryBlocks: [
      {
        heading: "Separating API Logic into `services/notes.js`",
        text: "Do not scatter `axios.get` calls throughout UI components. Extract all backend communication into a dedicated service module.",
        codeSnippet: `// services/notes.js:\nimport axios from 'axios';\nconst baseUrl = 'http://localhost:3001/notes';\n\nconst getAll = () => axios.get(baseUrl);\nconst create = newObject => axios.post(baseUrl, newObject);\nconst update = (id, newObject) => axios.put(\`\${baseUrl}/\${id}\`, newObject);\n\nexport default { getAll, create, update };`,
        terminalOutput: `Clean separation of concerns: Components handle UI; Services handle APIs`,
        mcq: {
          id: "q-2.5-0-v1",
          question: "Why should API calls be extracted into a dedicated service module (e.g., `services/notes.js`)?",
          options: [
            { id: "A", text: "To separate UI rendering logic from data transport logic, keeping components clean and maintainable", explanationIfWrong: "" },
            { id: "B", text: "Because React forbids importing Axios inside component files", explanationIfWrong: "React allows importing Axios anywhere; separation is an architectural best practice." },
            { id: "C", text: "To compress the API responses by 80%", explanationIfWrong: "Services do not perform network compression." },
            { id: "D", text: "To convert HTTP into WebSockets automatically", explanationIfWrong: "Services do not change transport protocols." }
          ],
          correctAnswer: "A",
          explanationNote: "Extracting services enforces separation of concerns: components focus on UI, while services encapsulate HTTP network logic."
        },
        retestMcq: {
          id: "q-2.5-0-v2",
          question: "If the backend API URL changes from `/notes` to `/api/v1/notes`, how many files must be modified if using a service module?",
          options: [
            { id: "A", text: "Only the single service file `services/notes.js` where `baseUrl` is defined", explanationIfWrong: "" },
            { id: "B", text: "Every single component across the entire repository", explanationIfWrong: "Because components call service methods, they don't know the URL." },
            { id: "C", text: "index.html and package.json", explanationIfWrong: "HTML and package.json do not store API URLs." },
            { id: "D", text: "The Git commit history", explanationIfWrong: "Git history is immutable." }
          ],
          correctAnswer: "A",
          explanationNote: "Centralizing `baseUrl` inside the service module means endpoint updates only need to be changed in one place."
        }
      },
      {
        heading: "Returning `response.data` Directly from Services",
        text: "Services can unwrap `response.data` so calling components only receive the actual payload data without having to navigate the Axios response object.",
        codeSnippet: `// services/notes.js:\nconst getAll = () => {\n  const request = axios.get(baseUrl);\n  return request.then(response => response.data);\n};\n\n// Inside Component:\nnoteService.getAll().then(initialNotes => {\n  setNotes(initialNotes); // Directly receives data array!\n});`,
        terminalOutput: `Components receive pure data payloads, unaware of HTTP transport details`,
        mcq: {
          id: "q-2.5-1-v1",
          question: "What is the benefit of writing `return request.then(response => response.data)` inside the service module?",
          options: [
            { id: "A", text: "The calling component receives the pure data array directly without needing to know about Axios response wrappers", explanationIfWrong: "" },
            { id: "B", text: "It converts the Promise into a synchronous variable", explanationIfWrong: "It still returns a Promise, but resolves with response.data." },
            { id: "C", text: "It cancels the HTTP request if the user navigates away", explanationIfWrong: "Promise chaining does not automatically cancel requests." },
            { id: "D", text: "It encrypts the payload on the client", explanationIfWrong: "No encryption occurs." }
          ],
          correctAnswer: "A",
          explanationNote: "Unwrapping `response.data` in the service cleanly shields UI components from HTTP library-specific metadata."
        },
        retestMcq: {
          id: "q-2.5-1-v2",
          question: "When a Promise's `.then()` returns a value `x`, what does the chained promise resolve with?",
          options: [
            { id: "A", text: "The value `x`", explanationIfWrong: "" },
            { id: "B", text: "null", explanationIfWrong: "Chained promises resolve with the return value of the previous callback." },
            { id: "C", text: "undefined", explanationIfWrong: "It resolves with x." },
            { id: "D", text: "An error object", explanationIfWrong: "It resolves successfully with x." }
          ],
          correctAnswer: "A",
          explanationNote: "In JavaScript Promise chains, returning a value from a `.then()` handler resolves the resulting promise with that exact value."
        }
      },
      {
        heading: "Using ES6 Object Shorthand for Exporting Services",
        text: "When an object key matches the variable name, ES6 shorthand allows exporting `{ getAll, create, update }` instead of `{ getAll: getAll }`.",
        codeSnippet: `const getAll = () => { ... };\nconst create = () => { ... };\nconst update = () => { ... };\n\nexport default {\n  getAll,\n  create,\n  update\n};`,
        terminalOutput: `Exported service object with methods noteService.getAll(), noteService.create()`,
        mcq: {
          id: "q-2.5-2-v1",
          question: "In JavaScript ES6, what is `{ getAll, create }` equivalent to?",
          options: [
            { id: "A", text: "`{ getAll: getAll, create: create }`", explanationIfWrong: "" },
            { id: "B", text: "`['getAll', 'create']`", explanationIfWrong: "Curly braces create an object, not an array." },
            { id: "C", text: "`getAll && create`", explanationIfWrong: "This is a logical expression, not an object literal." },
            { id: "D", text: "`getAll.bind(create)`", explanationIfWrong: "bind binds function contexts." }
          ],
          correctAnswer: "A",
          explanationNote: "ES6 object property shorthand allows writing `{ name }` when the key and variable identifier have the exact same name."
        },
        retestMcq: {
          id: "q-2.5-2-v2",
          question: "How do you import a service exported as `export default { getAll, create }`?",
          options: [
            { id: "A", text: "`import noteService from './services/notes'`", explanationIfWrong: "" },
            { id: "B", text: "`import { default } from './services/notes'`", explanationIfWrong: "Default imports do not use curly braces." },
            { id: "C", text: "`import * as default from './services/notes'`", explanationIfWrong: "default is a reserved keyword." },
            { id: "D", text: "`const noteService = import('./services/notes')`", explanationIfWrong: "Dynamic import returns a promise, not the direct module." }
          ],
          correctAnswer: "A",
          explanationNote: "Default exports can be given any descriptive identifier (such as `noteService`) when imported without curly braces."
        }
      },
      {
        heading: "Consistent Error Propagation in Services",
        text: "Do not swallow errors inside service functions. Let errors propagate so components can display tailored feedback to the user.",
        codeSnippet: `// In Service: Unwraps data or allows rejection to bubble up\nconst update = (id, newObject) => {\n  return axios.put(\`\${baseUrl}/\${id}\`, newObject).then(res => res.data);\n};\n\n// In Component: Catches error and sets user notification\nnoteService.update(id, obj)\n  .then(updated => setNotes(notes.map(n => n.id !== id ? n : updated)))\n  .catch(err => setErrorMessage(\`Error updating note: \${err.message}\`));`,
        terminalOutput: `Error bubbles up cleanly to the UI layer where it can be shown to the user`,
        mcq: {
          id: "q-2.5-3-v1",
          question: "Why should services let Promise rejections bubble up to the component rather than catching and hiding them?",
          options: [
            { id: "A", text: "Because UI components need to know an error occurred to display user notifications and update state accordingly", explanationIfWrong: "" },
            { id: "B", text: "Because JavaScript crashes if a service handles an error", explanationIfWrong: "JavaScript allows error handling anywhere; architecture determines the best place." },
            { id: "C", text: "Because backend servers reject catches", explanationIfWrong: "The server is unaware of client-side catch handlers." },
            { id: "D", text: "To force the browser to restart", explanationIfWrong: "Errors should be handled gracefully." }
          ],
          correctAnswer: "A",
          explanationNote: "If the service swallows the error, the calling component assumes the action succeeded, leading to state desynchronization."
        },
        retestMcq: {
          id: "q-2.5-3-v2",
          question: "How do you re-throw or propagate an error in a Promise chain?",
          options: [
            { id: "A", text: "Do not catch it in the service, or throw a new error inside `.catch(err => { throw err; })`", explanationIfWrong: "" },
            { id: "B", text: "Return null from .catch()", explanationIfWrong: "Returning null resolves the promise, hiding the error!" },
            { id: "C", text: "Call process.exit(1)", explanationIfWrong: "process.exit is for Node.js scripts, not browser applications." },
            { id: "D", text: "Write console.log('error')", explanationIfWrong: "console.log logs text but does not propagate rejections." }
          ],
          correctAnswer: "A",
          explanationNote: "Throwing an error inside `.catch()` or omitting the catch handler allows the rejection to bubble up to the caller."
        }
      },
      {
        heading: "Clean Asynchronous Code Architecture",
        text: "By organizing data fetching into services, your React components stay declarative, readable, and focused strictly on user interactions.",
        codeSnippet: `const App = () => {\n  const [notes, setNotes] = useState([]);\n\n  useEffect(() => {\n    noteService.getAll().then(initialNotes => setNotes(initialNotes));\n  }, []);\n\n  const addNote = (noteObject) => {\n    noteService.create(noteObject).then(savedNote => {\n      setNotes(notes.concat(savedNote));\n    });\n  };\n};`,
        terminalOutput: `Declarative component: 15 lines of pure UI logic instead of 50 lines of HTTP plumbing`,
        mcq: {
          id: "q-2.5-4-v1",
          question: "How does isolating API logic into services improve automated testing?",
          options: [
            { id: "A", text: "You can easily mock the service module in component tests without making real network HTTP requests", explanationIfWrong: "" },
            { id: "B", text: "It allows tests to run without installing Node.js", explanationIfWrong: "Test runners like Jest require Node.js." },
            { id: "C", text: "It guarantees 100% test coverage automatically", explanationIfWrong: "Test coverage requires authoring test cases." },
            { id: "D", text: "It converts React components into HTML files", explanationIfWrong: "Tests execute against Virtual DOM or real DOM." }
          ],
          correctAnswer: "A",
          explanationNote: "Separating API services allows test suites to mock `noteService.getAll()` with dummy data, enabling fast, isolated unit tests."
        },
        retestMcq: {
          id: "q-2.5-4-v2",
          question: "What architectural pattern does separating UI from Services follow?",
          options: [
            { id: "A", text: "Layered architecture / Separation of concerns", explanationIfWrong: "" },
            { id: "B", text: "Spaghetti code architecture", explanationIfWrong: "Spaghetti code is unorganized, coupled code." },
            { id: "C", text: "Monolithic global scope", explanationIfWrong: "Separation of concerns is modular." },
            { id: "D", text: "Peer-to-peer torrent protocol", explanationIfWrong: "Torrents are for decentralized file sharing." }
          ],
          correctAnswer: "A",
          explanationNote: "Layering the application into UI components and data service layers is a fundamental pattern for scalable applications."
        }
      },
      {
        heading: "Dynamic URL Configuration (Dev vs Prod Preview)",
        text: "In development, the API URL might be `http://localhost:3001/api/notes`. In production, relative URLs like `/api/notes` are used because the frontend and backend share the same domain.",
        codeSnippet: `// Relative URL works seamlessly in production:\nconst baseUrl = '/api/notes';\n\n// Axios automatically requests http://yourdomain.com/api/notes`,
        terminalOutput: `Development: proxy to 3001 | Production: direct relative path`,
        mcq: {
          id: "q-2.5-5-v1",
          question: "Why are relative URLs like `const baseUrl = '/api/notes'` preferred when deploying full-stack apps to production?",
          options: [
            { id: "A", text: "The frontend and backend are served from the same origin/domain, so hardcoded hostnames are unnecessary", explanationIfWrong: "" },
            { id: "B", text: "Relative URLs bypass all network firewalls", explanationIfWrong: "Firewalls inspect all network traffic." },
            { id: "C", text: "Absolute URLs are illegal under web standards", explanationIfWrong: "Absolute URLs are completely valid." },
            { id: "D", text: "Relative URLs encrypt database queries", explanationIfWrong: "Encryption is handled by TLS/HTTPS." }
          ],
          correctAnswer: "A",
          explanationNote: "When frontend and backend are hosted on the same server, relative paths (`/api/notes`) work everywhere without changing domain names."
        },
        retestMcq: {
          id: "q-2.5-5-v2",
          question: "What happens if you deploy an app to production with a hardcoded `http://localhost:3001/notes` URL?",
          options: [
            { id: "A", text: "The app fails for end users because their browsers attempt to connect to their own local computers instead of your server", explanationIfWrong: "" },
            { id: "B", text: "The browser automatically finds your server's IP address", explanationIfWrong: "localhost always resolves to the client's own machine (127.0.0.1)." },
            { id: "C", text: "The app works normally", explanationIfWrong: "It fails on any device other than the developer's laptop." },
            { id: "D", text: "The server crashes immediately", explanationIfWrong: "The server is fine; client requests fail to reach it." }
          ],
          correctAnswer: "A",
          explanationNote: "`localhost` points to the user's local machine. In production, users will receive connection refused errors."
        }
      }
    ]
  },
  {
    id: "2-6-styling-notification-messages",
    number: "2.6",
    title: "Component Styling & Notification Alerts",
    subtitle: "Implement timed notification bars, error feedback banners, CSS modules, and conditional alert styling in React.",
    readTime: "14 min",
    objectives: [
      "Build dynamic notification alert components in React",
      "Manage notification messages and types (success, error) in state",
      "Automatically clear notifications after a delay using `setTimeout`",
      "Style React components using external stylesheets and CSS classes",
      "Apply conditional class names based on state",
      "Avoid memory leaks with timer cleanups"
    ],
    theoryBlocks: [
      {
        heading: "Notification Component & State",
        text: "A notification banner renders an alert message when state is present. If the message is `null`, it renders nothing.",
        codeSnippet: `const Notification = ({ message, type }) => {\n  if (message === null) return null;\n\n  return (\n    <div className={\`notification \${type === 'error' ? 'error' : 'success'}\`}>\n      {message}\n    </div>\n  );\n};`,
        terminalOutput: `Renders green banner for success, red for error, and null when empty`,
        mcq: {
          id: "q-2.6-0-v1",
          question: "Why should `Notification` return `null` when `message === null`?",
          options: [
            { id: "A", text: "Returning `null` tells React to render nothing to the DOM, hiding the notification completely", explanationIfWrong: "" },
            { id: "B", text: "React throws a syntax error if components return empty strings", explanationIfWrong: "Empty strings are valid, but null is the canonical way to render nothing." },
            { id: "C", text: "Returning null closes the browser tab", explanationIfWrong: "Returning null does not close tabs." },
            { id: "D", text: "It resets all form inputs", explanationIfWrong: "Form inputs are separate." }
          ],
          correctAnswer: "A",
          explanationNote: "In React, returning `null` from a component is the standard way to render nothing into the DOM."
        },
        retestMcq: {
          id: "q-2.6-0-v2",
          question: "How do you store both a message and an alert type in React state cleanly?",
          options: [
            { id: "A", text: "Store an object `const [notification, setNotification] = useState({ text: 'Added!', type: 'success' })` or two states", explanationIfWrong: "" },
            { id: "B", text: "Save the text inside an HTML comment", explanationIfWrong: "HTML comments are not accessible as reactive state." },
            { id: "C", text: "Write the message into CSS stylesheets", explanationIfWrong: "Stylesheets contain styling rules, not dynamic state." },
            { id: "D", text: "Alert types must always be numbers from 1 to 10", explanationIfWrong: "Strings like 'success' or 'error' are standard." }
          ],
          correctAnswer: "A",
          explanationNote: "Storing an object with `{ text, type }` or two distinct state variables allows toggling colors and messages easily."
        }
      },
      {
        heading: "Timed Alerts with `setTimeout`",
        text: "Use `setTimeout` to automatically clear the notification message after 3 to 5 seconds so alerts disappear on their own.",
        codeSnippet: `const notify = (text, type = 'success') => {\n  setNotification({ text, type });\n  setTimeout(() => {\n    setNotification(null);\n  }, 5000); // Disappears after 5 seconds\n};`,
        terminalOutput: `Notification displays for 5000ms -> automatically resets to null`,
        mcq: {
          id: "q-2.6-1-v1",
          question: "What does `setTimeout(() => setNotification(null), 5000)` accomplish?",
          options: [
            { id: "A", text: "It waits 5,000 milliseconds (5 seconds) and then resets the notification to null, hiding the banner", explanationIfWrong: "" },
            { id: "B", text: "It freezes the browser for 5 seconds", explanationIfWrong: "setTimeout is non-blocking and asynchronous." },
            { id: "C", text: "It repeats the notification every 5 seconds forever", explanationIfWrong: "setInterval repeats; setTimeout runs only once." },
            { id: "D", text: "It deletes the database after 5 seconds", explanationIfWrong: "It only resets local state." }
          ],
          correctAnswer: "A",
          explanationNote: "`setTimeout` schedules a one-time execution of the callback function after the specified delay in milliseconds."
        },
        retestMcq: {
          id: "q-2.6-1-v2",
          question: "What is the difference between `setTimeout` and `setInterval`?",
          options: [
            { id: "A", text: "`setTimeout` executes its callback once after a delay; `setInterval` executes repeatedly at specified intervals", explanationIfWrong: "" },
            { id: "B", text: "`setTimeout` is synchronous, while `setInterval` is asynchronous", explanationIfWrong: "Both are asynchronous browser timer APIs." },
            { id: "C", text: "`setInterval` was removed in modern ES6", explanationIfWrong: "Both APIs remain standard." },
            { id: "D", text: "`setTimeout` is only supported in Node.js", explanationIfWrong: "Both are available in browsers and Node.js." }
          ],
          correctAnswer: "A",
          explanationNote: "`setTimeout` runs once when the countdown expires. `setInterval` fires repeatedly until cancelled with `clearInterval`."
        }
      },
      {
        heading: "Styling React with CSS Classes",
        text: "Import an external CSS file (`import './index.css'`) and attach styling to elements using the `className` attribute.",
        codeSnippet: `// index.css:\n.notification {\n  color: #00ff9d;\n  background: rgba(0, 255, 157, 0.1);\n  border: 1px solid #00ff9d;\n  border-radius: 12px;\n  padding: 12px 16px;\n}\n.error {\n  color: #f43f5e;\n  border-color: #f43f5e;\n}`,
        terminalOutput: `Clean, modern styling applied via standard CSS classes`,
        mcq: {
          id: "q-2.6-2-v1",
          question: "How do you apply a CSS class from an imported stylesheet to a JSX element?",
          options: [
            { id: "A", text: "Using the `className` attribute: `<div className=\"notification\">`", explanationIfWrong: "" },
            { id: "B", text: "Using the `class` attribute: `<div class=\"notification\">`", explanationIfWrong: "class is a reserved word in JS; JSX uses className." },
            { id: "C", text: "Using `<div css=\"notification\">`", explanationIfWrong: "css is not a standard JSX attribute." },
            { id: "D", text: "Using inline SQL queries", explanationIfWrong: "CSS styling is separate from SQL." }
          ],
          correctAnswer: "A",
          explanationNote: "In JSX, HTML classes are declared using `className` to avoid colliding with JavaScript's reserved `class` keyword."
        },
        retestMcq: {
          id: "q-2.6-2-v2",
          question: "How do you conditionally apply the `'error'` class when `isError` is true in template literals?",
          options: [
            { id: "A", text: "`className={\`notification \${isError ? 'error' : 'success'}\`}`", explanationIfWrong: "" },
            { id: "B", text: "`className='notification if isError then error'`", explanationIfWrong: "Strings cannot contain if statements." },
            { id: "C", text: "`className=[notification, error]`", explanationIfWrong: "className expects a string, not an array of identifiers." },
            { id: "D", text: "`className: isError`", explanationIfWrong: "Invalid syntax." }
          ],
          correctAnswer: "A",
          explanationNote: "Combining template literals with ternary expressions `${isError ? 'error' : 'success'}` is the standard way to toggle CSS classes dynamically."
        }
      },
      {
        heading: "Inline Styles in React",
        text: "Inline styles in React are written as JavaScript objects with camelCased property names (`backgroundColor` instead of `background-color`).",
        codeSnippet: `const footerStyle = {\n  color: '#94a3b8',\n  fontSize: 14,\n  fontStyle: 'italic',\n  marginTop: 20\n};\n\nreturn <div style={footerStyle}>Full Stack Open — University of Helsinki</div>;`,
        terminalOutput: `<div style="color: #94a3b8; font-size: 14px; font-style: italic; margin-top: 20px;">`,
        mcq: {
          id: "q-2.6-3-v1",
          question: "Why must CSS properties in React inline styles be written in camelCase (e.g., `fontSize`) rather than hyphenated (e.g., `font-size`)?",
          options: [
            { id: "A", text: "Because inline styles are JavaScript objects, and hyphens represent subtraction operators in JavaScript", explanationIfWrong: "" },
            { id: "B", text: "HTML5 banned hyphenated CSS properties", explanationIfWrong: "HTML and CSS still use hyphens." },
            { id: "C", text: "CamelCase styles render with 3D graphics acceleration", explanationIfWrong: "Casing does not affect hardware acceleration." },
            { id: "D", text: "To compress file sizes", explanationIfWrong: "It is a JavaScript language syntax requirement." }
          ],
          correctAnswer: "A",
          explanationNote: "In JavaScript objects, `font-size` would be parsed as `font minus size`. CamelCase (`fontSize`) avoids syntax errors."
        },
        retestMcq: {
          id: "q-2.6-3-v2",
          question: "When writing inline styles directly in JSX, why are double curly braces used: `style={{ color: 'green' }}`?",
          options: [
            { id: "A", text: "The outer braces enter JSX JavaScript expression mode, and the inner braces declare an object literal", explanationIfWrong: "" },
            { id: "B", text: "Double braces denote an encrypted CSS rule", explanationIfWrong: "No encryption occurs." },
            { id: "C", text: "React requires double braces for all HTML attributes", explanationIfWrong: "Only style objects or nested objects need double braces." },
            { id: "D", text: "To make the text bold", explanationIfWrong: "Font weight controls boldness." }
          ],
          correctAnswer: "A",
          explanationNote: "The outer `{}` is the JSX evaluation tag; the inner `{}` creates the JavaScript style object `{ color: 'green' }`."
        }
      },
      {
        heading: "Handling Concurrent Notifications (Timer Overlaps)",
        text: "If a user triggers multiple notifications in quick succession, previous timers should be cleared to prevent early dismissal of the latest alert.",
        codeSnippet: `const timeoutRef = useRef(null);\n\nconst showNotification = (msg) => {\n  if (timeoutRef.current) clearTimeout(timeoutRef.current);\n  setMessage(msg);\n  timeoutRef.current = setTimeout(() => {\n    setMessage(null);\n  }, 4000);\n};`,
        terminalOutput: `Clears stale timeout -> guarantees full 4000ms duration for new alert`,
        mcq: {
          id: "q-2.6-4-v1",
          question: "What issue arises if you do not clear the previous `setTimeout` when a new notification is triggered?",
          options: [
            { id: "A", text: "The old timer will fire prematurely and hide the new notification before its full time has elapsed", explanationIfWrong: "" },
            { id: "B", text: "The computer's CPU will overheat", explanationIfWrong: "Timers consume negligible CPU." },
            { id: "C", text: "React throws a missing key warning", explanationIfWrong: "Key warnings are for lists." },
            { id: "D", text: "The user is logged out automatically", explanationIfWrong: "Timers do not affect auth state." }
          ],
          correctAnswer: "A",
          explanationNote: "If the first timer was 3 seconds in and you trigger a new alert, the old timer fires after 1 second, prematurely closing the new alert."
        },
        retestMcq: {
          id: "q-2.6-4-v2",
          question: "How do you cancel a pending `setTimeout` timer in JavaScript?",
          options: [
            { id: "A", text: "`clearTimeout(timerId)`", explanationIfWrong: "" },
            { id: "B", text: "`delete setTimeout`", explanationIfWrong: "delete does not stop timers." },
            { id: "C", text: "`timerId.stop()`", explanationIfWrong: "Timers are numerical IDs, not objects with methods." },
            { id: "D", text: "`setTimeout.abort()`", explanationIfWrong: "clearTimeout is the standard API." }
          ],
          correctAnswer: "A",
          explanationNote: "`clearTimeout(timerId)` cancels the scheduled timeout task before it has a chance to execute."
        }
      },
      {
        heading: "Synthesizing Part 2: Complete CRUD Architecture",
        text: "Full Stack Open Part 2 unifies controlled inputs, collection rendering, REST APIs, service abstraction, and visual notifications into a complete, professional application.",
        codeSnippet: `// 1. Service: noteService.create(newNote)\n// 2. State: setNotes(notes.concat(savedNote))\n// 3. Form: setNewNote('')\n// 4. Feedback: setNotification('Note saved successfully!')\n// 5. Cleanup: setTimeout(() => setNotification(null), 4000)`,
        terminalOutput: `Full Stack Open Part 2 Mastered! Ready for Part 3: Node.js & Express backend`,
        mcq: {
          id: "q-2.6-5-v1",
          question: "Which of the following describes the complete data flow of a form submission in a modern React application communicating with a server?",
          options: [
            { id: "A", text: "User submits -> event.preventDefault() -> service sends POST request -> state updates with server response -> input clears -> success alert shows", explanationIfWrong: "" },
            { id: "B", text: "User submits -> page reloads -> server writes to client hard drive -> app restarts", explanationIfWrong: "React SPAs do not reload the page or access hard drives directly." },
            { id: "C", text: "User submits -> React converts to PHP -> database prints to terminal", explanationIfWrong: "React does not convert to PHP." },
            { id: "D", text: "User submits -> CSS file re-downloads from Google Fonts", explanationIfWrong: "Fonts are unrelated to form submissions." }
          ],
          correctAnswer: "A",
          explanationNote: "This end-to-end lifecycle represents the standard, robust architecture of single-page React applications communicating with REST backends."
        },
        retestMcq: {
          id: "q-2.6-5-v2",
          question: "What core foundation learned in Part 2 is directly built upon in Part 3 (Node.js & Express)?",
          options: [
            { id: "A", text: "The REST API architecture (GET, POST, PUT, DELETE) and HTTP status codes that the Node.js backend will now implement", explanationIfWrong: "" },
            { id: "B", text: "CSS flexbox rules", explanationIfWrong: "Backends do not process CSS." },
            { id: "C", text: "Browser localStorage APIs", explanationIfWrong: "Node.js runs on servers, where localStorage is not available." },
            { id: "D", text: "JSX compilation syntax", explanationIfWrong: "Express backends handle JSON endpoints, not JSX rendering." }
          ],
          correctAnswer: "A",
          explanationNote: "In Part 2 you consumed REST APIs; in Part 3 you build the real Node/Express backend that serves those exact endpoints."
        }
      }
    ]
  }
];

// Helper functions for Level attempts, question selection, and 3-consecutive-failure progression lock
export const getLevelAttemptCountFullstackPart2 = (sectionId: string, studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_fullstack_p2_attempt_${sectionId}_${studentId}`);
    return saved ? Number(saved) : 1;
  } catch {
    return 1;
  }
};

export const setLevelAttemptCountFullstackPart2 = (sectionId: string, studentId: string, count: number): void => {
  try {
    localStorage.setItem(`dopilot_fullstack_p2_attempt_${sectionId}_${studentId}`, String(count));
  } catch {}
};

export const getActiveQuestionsForLevelFullstackPart2 = (
  section: SectionContent,
  studentId: string,
  forceRetest: boolean = false
): McqQuestion[] => {
  const attempt = forceRetest ? 2 : getLevelAttemptCountFullstackPart2(section.id, studentId);
  return section.theoryBlocks.map((block) => {
    if (attempt >= 2 && block.retestMcq) {
      return block.retestMcq;
    }
    return block.mcq!;
  });
};

export const getConsecutiveFailedLevelsFullstackPart2 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_fullstack_p2_failed_levels_streak_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const recordLevelAttemptResultFullstackPart2 = (
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
  const currentAttempt = getLevelAttemptCountFullstackPart2(sectionId, studentId);

  if (isPassed) {
    try {
      localStorage.setItem(`dopilot_fullstack_p2_failed_levels_streak_${studentId}`, '0');
      localStorage.setItem(`dopilot_fullstack_p2_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_fullstack_p2_attempt_${sectionId}_${studentId}`, '1');
      localStorage.removeItem(`dopilot_fullstack_p2_locked_${studentId}`);
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
      setLevelAttemptCountFullstackPart2(sectionId, studentId, 2);
      const streak = getConsecutiveFailedLevelsFullstackPart2(studentId);

      return {
        isPassed: false,
        attemptCount: 1,
        isSecondFailureInLevel: false,
        consecutiveFailedLevels: streak,
        isLocked: false
      };
    } else {
      const prevStreak = getConsecutiveFailedLevelsFullstackPart2(studentId);
      const newStreak = prevStreak + 1;
      const isLocked = newStreak >= 3;

      try {
        localStorage.setItem(`dopilot_fullstack_p2_failed_levels_streak_${studentId}`, String(newStreak));
        localStorage.setItem(`dopilot_fullstack_p2_consecutive_failures_${studentId}`, String(newStreak));
        if (isLocked) {
          localStorage.setItem(`dopilot_fullstack_p2_locked_${studentId}`, 'true');
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

export const resetConsecutiveFailuresFullstackPart2 = (studentId: string): void => {
  try {
    localStorage.setItem(`dopilot_fullstack_p2_consecutive_failures_${studentId}`, '0');
    localStorage.setItem(`dopilot_fullstack_p2_failed_levels_streak_${studentId}`, '0');
    localStorage.removeItem(`dopilot_fullstack_p2_locked_${studentId}`);
  } catch {}
};
