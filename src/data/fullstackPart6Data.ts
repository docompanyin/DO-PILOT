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

export const FULLSTACK_PART_6_SECTIONS: SectionContent[] = [
  {
    id: "6-1-flux-architecture-redux-core",
    number: "6.1",
    title: "Flux Architecture & Redux Core Principles",
    subtitle: "Understand unidirectional data flow, write pure reducer functions, dispatch action objects, and manage state with Redux createStore.",
    readTime: "12 min",
    objectives: [
      "Understand the Flux unidirectional data flow architecture",
      "Write pure reducer functions that calculate next state without mutations",
      "Dispatch action objects containing 'type' and optional 'payload'",
      "Manage central application state with Redux createStore",
      "Subscribe to state changes with store.subscribe() and read state with store.getState()",
      "Use deep-freeze to verify that reducers do not mutate previous state"
    ],
    theoryBlocks: [
      {
        heading: "Flux Architecture & Unidirectional Flow",
        text: "In the Flux architecture, state changes follow a strict one-way cycle: Views dispatch Actions, which are handled by Reducers to update the central Store, which re-renders Views.",
        codeSnippet: `// Unidirectional Cycle:\n// [User Action / View] ---> (Dispatch Action) ---> [Reducer] ---> [Central Store] ---> (Re-render View)`,
        mcq: {
          id: "q-6.1-0-v1",
          question: "What is the primary advantage of unidirectional data flow in the Flux/Redux architecture?",
          options: [
            { id: "A", text: "State changes become predictable and easy to trace because state can only ever be modified by dispatching discrete actions to reducers", explanationIfWrong: "Unidirectional flow prevents cascading unpredictable two-way data bindings." },
            { id: "B", text: "It allows components to directly modify each other's local state variables", explanationIfWrong: "Components cannot directly mutate other components' state; everything flows through the store." },
            { id: "C", text: "It replaces the need for an Express backend server", explanationIfWrong: "Flux/Redux is a frontend state architecture, unrelated to backend servers." },
            { id: "D", text: "It compresses JavaScript bundle size by 90%", explanationIfWrong: "Flux is a structural pattern, not a code compression algorithm." }
          ],
          correctAnswer: "A",
          explanationNote: "Unidirectional data flow ensures that state can only change through explicit, logged actions processed by pure reducers, making state management predictable and debuggable."
        },
        retestMcq: {
          id: "q-6.1-0-v2",
          question: "What problem in complex applications led Facebook to design the Flux architecture?",
          options: [
            { id: "A", text: "Bidirectional data bindings caused unpredictable cascading updates where changing one model triggered unexpected updates across multiple other views", explanationIfWrong: "Two-way data binding in MVC often caused hard-to-debug cascading changes." },
            { id: "B", text: "Computers in 2014 were unable to render HTML without server reboots", explanationIfWrong: "Browsers have always rendered HTML; architectural predictability was the goal." },
            { id: "C", text: "JavaScript was lacking support for functions", explanationIfWrong: "JavaScript has always had first-class functions." },
            { id: "D", text: "React components were unable to receive props", explanationIfWrong: "React has always supported props; Flux addressed global state orchestration." }
          ],
          correctAnswer: "A",
          explanationNote: "Bidirectional updates in traditional MVC patterns often created cascading change loops; Flux solved this by enforcing a strict one-way data lifecycle."
        }
      },
      {
        heading: "Pure Reducer Functions",
        text: "A reducer is a pure function that takes (state, action) and returns the new state without mutating the previous state or triggering side effects.",
        codeSnippet: `const counterReducer = (state = 0, action) => {\n  switch (action.type) {\n    case 'INCREMENT':\n      return state + 1;\n    case 'DECREMENT':\n      return state - 1;\n    case 'ZERO':\n      return 0;\n    default:\n      return state;\n  }\n};`,
        mcq: {
          id: "q-6.1-1-v1",
          question: "Why must a Redux reducer function always return the existing state in its 'default' case?",
          options: [
            { id: "A", text: "When unhandled actions (or Redux initialization probes) are dispatched, the reducer must return the current state unchanged to avoid resetting state to undefined", explanationIfWrong: "Redux dispatches internal probe actions; returning default state preserves current data." },
            { id: "B", text: "Because JavaScript throws a switch error if default is missing", explanationIfWrong: "JavaScript switch statements do not require a default case by syntax." },
            { id: "C", text: "To automatically delete previous state from browser memory", explanationIfWrong: "Returning current state keeps data alive, not deletes it." },
            { id: "D", text: "To trigger a full page reload", explanationIfWrong: "Reducers are pure in-memory calculation functions." }
          ],
          correctAnswer: "A",
          explanationNote: "Redux initializes the store by dispatching an internal action. If the reducer does not return the current state for unrecognized actions, state becomes undefined."
        },
        retestMcq: {
          id: "q-6.1-1-v2",
          question: "What does it mean for a reducer function to be 'pure'?",
          options: [
            { id: "A", text: "Given the same arguments, it always returns the exact same result, without mutating its inputs or causing observable side effects (no network calls, no Math.random(), no Date.now())", explanationIfWrong: "Pure functions are deterministic and produce zero side-effects." },
            { id: "B", text: "It cannot contain more than 10 lines of code", explanationIfWrong: "Function purity refers to mathematical determinism, not code length." },
            { id: "C", text: "It must be written entirely in TypeScript", explanationIfWrong: "Pure functions can be written in any language." },
            { id: "D", text: "It automatically clears browser cookies", explanationIfWrong: "Clearing cookies is an external side-effect, violating purity." }
          ],
          correctAnswer: "A",
          explanationNote: "A pure function is deterministic: it computes the next state solely from its input state and action, never modifying arguments or executing external side-effects."
        }
      },
      {
        heading: "Verifying Immutability with deep-freeze",
        text: "The deep-freeze library freezes state objects in unit tests, ensuring that reducers throw errors if they attempt to mutate existing state arrays or objects directly.",
        codeSnippet: `import deepFreeze from 'deep-freeze';\n\ntest('noteReducer adds new note without mutating state', () => {\n  const state = [];\n  const action = { type: 'NEW_NOTE', payload: { content: 'test note', id: 1 } };\n  deepFreeze(state);\n  const newState = noteReducer(state, action);\n  expect(newState).toHaveLength(1);\n});`,
        mcq: {
          id: "q-6.1-2-v1",
          question: "What happens if noteReducer executes state.push(newNote) while state is wrapped with deepFreeze(state)?",
          options: [
            { id: "A", text: "JavaScript throws a TypeError because deepFreeze marks the object and all its nested properties as non-extensible and read-only", explanationIfWrong: "deepFreeze recursively calls Object.freeze, causing any mutation to throw." },
            { id: "B", text: "The test passes silently", explanationIfWrong: "The mutation throws an error, failing the test immediately." },
            { id: "C", text: "The computer's operating system reboots", explanationIfWrong: "deepFreeze operates purely inside JavaScript runtime memory." },
            { id: "D", text: "The array converts itself into a SQL query", explanationIfWrong: "deepFreeze is an immutability testing tool, unrelated to SQL." }
          ],
          correctAnswer: "A",
          explanationNote: "deepFreeze recursively applies Object.freeze to the object tree. Any direct mutation (like .push() or property assignment) immediately throws a TypeError."
        },
        retestMcq: {
          id: "q-6.1-2-v2",
          question: "Which of the following array operations is safe to use inside a reducer because it does NOT mutate the original array?",
          options: [
            { id: "A", text: "state.concat(action.payload)", explanationIfWrong: "concat() returns a brand-new array without altering the original array." },
            { id: "B", text: "state.push(action.payload)", explanationIfWrong: "push() mutates the original array in place." },
            { id: "C", text: "state.reverse()", explanationIfWrong: "reverse() reverses the original array in place." },
            { id: "D", text: "state.splice(0, 1)", explanationIfWrong: "splice() modifies the original array contents in place." }
          ],
          correctAnswer: "A",
          explanationNote: "Array.prototype.concat() creates and returns a new array, preserving the immutability of the incoming state parameter."
        }
      },
      {
        heading: "Managing State with Redux Store",
        text: "The Redux store holds the whole state tree; store.dispatch(action) sends actions, store.getState() inspects state, and store.subscribe(cb) listens for updates.",
        codeSnippet: `import { createStore } from 'redux';\n\nconst store = createStore(counterReducer);\nconsole.log(store.getState()); // 0\nstore.dispatch({ type: 'INCREMENT' });\nconsole.log(store.getState()); // 1`,
        mcq: {
          id: "q-6.1-3-v1",
          question: "How do you trigger a state update in a Redux store?",
          options: [
            { id: "A", text: "By calling store.dispatch(action) with an action object containing a 'type' property", explanationIfWrong: "dispatch is the only way to trigger a state update in Redux." },
            { id: "B", text: "By directly reassigning store.state = newValue", explanationIfWrong: "Direct state assignment is prohibited; Redux stores state internally." },
            { id: "C", text: "By calling store.updateState()", explanationIfWrong: "The method is dispatch(), not updateState()." },
            { id: "D", text: "By writing to localStorage", explanationIfWrong: "Redux stores live in memory." }
          ],
          correctAnswer: "A",
          explanationNote: "The only way to modify state inside a Redux store is to dispatch an action object (e.g. store.dispatch({ type: 'INCREMENT' }))."
        },
        retestMcq: {
          id: "q-6.1-3-v2",
          question: "What function does store.subscribe(listener) perform in Redux?",
          options: [
            { id: "A", text: "It registers a callback function that is invoked whenever an action is dispatched and the store state may have changed", explanationIfWrong: "Subscribers run after every dispatch to react to state updates." },
            { id: "B", text: "It connects the application to an external newsletter mailing list", explanationIfWrong: "store.subscribe is an in-memory event listener." },
            { id: "C", text: "It downloads missing npm packages from the internet", explanationIfWrong: "It has nothing to do with package managers." },
            { id: "D", text: "It automatically saves the store state to MongoDB Atlas", explanationIfWrong: "It executes any callback function passed to it, such as re-rendering the UI." }
          ],
          correctAnswer: "A",
          explanationNote: "store.subscribe(callback) registers a listener that runs every time an action is dispatched, allowing UI layers to re-render with fresh state."
        }
      },
      {
        heading: "Action Creators Pattern",
        text: "Action creators are helper functions that return action objects, decoupling components from hardcoded action type strings and payloads.",
        codeSnippet: `// Action Creator:\nconst createNote = (content) => {\n  return {\n    type: 'NEW_NOTE',\n    payload: {\n      content,\n      important: false,\n      id: generateId()\n    }\n  };\n};\n\n// Dispatching:\nstore.dispatch(createNote('Understand Redux'));`,
        mcq: {
          id: "q-6.1-4-v1",
          question: "What is the primary benefit of using action creator functions rather than dispatching inline object literals?",
          options: [
            { id: "A", text: "They centralize action creation logic and protect against typos in action type strings and payload structures across components", explanationIfWrong: "Action creators abstract action creation into reusable, testable functions." },
            { id: "B", text: "They allow actions to be dispatched without a Redux store", explanationIfWrong: "Action creators simply return objects; a store is still needed to dispatch them." },
            { id: "C", text: "They prevent the browser from using CSS", explanationIfWrong: "Action creators are pure JavaScript functions." },
            { id: "D", text: "They eliminate the need for reducer functions", explanationIfWrong: "Reducers are still required to process the created actions." }
          ],
          correctAnswer: "A",
          explanationNote: "Action creators encapsulate the structure of actions, ensuring consistency, avoiding duplicated payload logic, and preventing hardcoded typo bugs."
        },
        retestMcq: {
          id: "q-6.1-4-v2",
          question: "What must every Redux action object contain at minimum according to standard Redux conventions?",
          options: [
            { id: "A", text: "A 'type' property describing the intent of the action (usually an uppercase string)", explanationIfWrong: "The 'type' field is mandatory for reducers to identify the action." },
            { id: "B", text: "A 'password' property", explanationIfWrong: "Passwords should never be included in standard action objects." },
            { id: "C", text: "A 'timestamp' generated by MongoDB", explanationIfWrong: "MongoDB timestamps are database fields, not required in Redux actions." },
            { id: "D", text: "A 'url' string pointing to an external website", explanationIfWrong: "Actions only require a 'type' property." }
          ],
          correctAnswer: "A",
          explanationNote: "Standard Flux Standard Action (FSA) conventions require actions to be plain objects with a 'type' property that specifies the operation."
        }
      },
      {
        heading: "Combining Multiple Reducers",
        text: "As applications grow, combineReducers merges multiple slice reducers into a single root reducer, where each slice manages its own domain state.",
        codeSnippet: `import { combineReducers, createStore } from 'redux';\n\nconst reducer = combineReducers({\n  notes: noteReducer,\n  filter: filterReducer\n});\nconst store = createStore(reducer);`,
        mcq: {
          id: "q-6.1-5-v1",
          question: "What does the root state object look like when store is created with combineReducers({ notes: noteReducer, filter: filterReducer })?",
          options: [
            { id: "A", text: "An object with two top-level keys: { notes: [...], filter: 'ALL' }", explanationIfWrong: "combineReducers shapes the global state tree using the keys provided in the object." },
            { id: "B", text: "A flat array combining notes and filter strings into a single list", explanationIfWrong: "combineReducers produces an object with namespaced keys, not a flat array." },
            { id: "C", text: "A binary Buffer containing encoded JSON", explanationIfWrong: "The state is a standard JavaScript object." },
            { id: "D", text: "A string containing the concatenated names of all reducers", explanationIfWrong: "State is an object with properties corresponding to reducer keys." }
          ],
          correctAnswer: "A",
          explanationNote: "combineReducers creates a state object whose keys match the keys passed to the configuration object (e.g. state.notes and state.filter)."
        },
        retestMcq: {
          id: "q-6.1-5-v2",
          question: "When an action is dispatched to a store configured with combineReducers, which reducers are called?",
          options: [
            { id: "A", text: "Every slice reducer is called with its respective state slice and the action", explanationIfWrong: "combineReducers passes the action to all slice reducers to see if any respond." },
            { id: "B", text: "Only the first reducer in the list is called", explanationIfWrong: "All combined reducers receive every dispatched action." },
            { id: "C", text: "Only reducers whose names match the action type", explanationIfWrong: "Reducers inspect action.type internally; all are invoked." },
            { id: "D", text: "No reducers are called until the page reloads", explanationIfWrong: "Dispatching invokes reducers synchronously." }
          ],
          correctAnswer: "A",
          explanationNote: "Every dispatched action is passed to all slice reducers. Each reducer computes its slice of the state tree (or returns its unchanged default state)."
        }
      }
    ]
  },
  {
    id: "6-2-react-redux-hooks",
    number: "6.2",
    title: "React-Redux: useSelector & useDispatch",
    subtitle: "Integrate React components with Redux using the Provider wrapper, select state slices with useSelector, and dispatch actions with useDispatch.",
    readTime: "12 min",
    objectives: [
      "Wrap React applications with the react-redux <Provider store={store}>",
      "Read specific state slices from the store using the useSelector hook",
      "Dispatch actions from components using the useDispatch hook",
      "Filter displayed items dynamically based on Redux filter state",
      "Prevent unnecessary re-renders by selecting only needed state properties",
      "Separate presentational display components from container logic"
    ],
    theoryBlocks: [
      {
        heading: "The <Provider> Component",
        text: "The react-redux <Provider> wraps the application root, making the Redux store available to any nested component via React Context.",
        codeSnippet: `import { Provider } from 'react-redux';\nimport store from './store';\n\nReactDOM.createRoot(document.getElementById('root')).render(\n  <Provider store={store}>\n    <App />\n  </Provider>\n);`,
        mcq: {
          id: "q-6.2-0-v1",
          question: "What role does the <Provider store={store}> component play in a React-Redux application?",
          options: [
            { id: "A", text: "It uses React Context to provide access to the Redux store for all nested components using useSelector and useDispatch", explanationIfWrong: "Provider injects the store into the React component tree." },
            { id: "B", text: "It compiles CSS stylesheets into JavaScript objects", explanationIfWrong: "Provider is purely for state context distribution." },
            { id: "C", text: "It downloads database backups from MongoDB Atlas", explanationIfWrong: "Provider is a frontend React component." },
            { id: "D", text: "It replaces all HTML <div> tags with WebGL canvases", explanationIfWrong: "Provider does not alter DOM elements; it supplies context." }
          ],
          correctAnswer: "A",
          explanationNote: "Provider wraps the component tree and passes the Redux store through React context so any child component can connect to state."
        },
        retestMcq: {
          id: "q-6.2-0-v2",
          question: "What error occurs if a component calls useSelector() outside of a <Provider> tree?",
          options: [
            { id: "A", text: "An error stating: 'could not find react-redux context value; please ensure the component is wrapped in a <Provider>'", explanationIfWrong: "useSelector requires an ancestor Provider to supply the store context." },
            { id: "B", text: "The component renders an empty black box", explanationIfWrong: "An unhandled context exception is thrown immediately." },
            { id: "C", text: "The browser deletes all React files", explanationIfWrong: "It throws a standard JavaScript runtime error." },
            { id: "D", text: "React automatically creates a mock store in localStorage", explanationIfWrong: "useSelector fails fast if Provider is missing." }
          ],
          correctAnswer: "A",
          explanationNote: "react-redux hooks rely on the context provided by <Provider>. If called outside a Provider, they throw a descriptive error."
        }
      },
      {
        heading: "Reading State with useSelector",
        text: "The useSelector hook receives a selector function that extracts and returns a specific slice of the Redux state tree.",
        codeSnippet: `import { useSelector } from 'react-redux';\n\nconst Notes = () => {\n  const notes = useSelector(state => state.notes);\n  return (\n    <ul>\n      {notes.map(note => <li key={note.id}>{note.content}</li>)}\n    </ul>\n  );\n};`,
        mcq: {
          id: "q-6.2-1-v1",
          question: "How does useSelector optimize component re-renders?",
          options: [
            { id: "A", text: "The component only re-renders if the value returned by the selector function has changed (tested via strict reference equality ===)", explanationIfWrong: "useSelector subscribes the component and skips rendering if the selected slice is unchanged." },
            { id: "B", text: "It prevents the component from ever re-rendering under any circumstances", explanationIfWrong: "Components must re-render when their selected state updates." },
            { id: "C", text: "It forces every component in the entire app to re-render on every keystroke", explanationIfWrong: "useSelector provides granular subscriptions, avoiding blanket re-renders." },
            { id: "D", text: "It converts state updates into synchronous HTTP calls", explanationIfWrong: "useSelector is purely a client-side reactive subscription hook." }
          ],
          correctAnswer: "A",
          explanationNote: "useSelector subscribes to the store and compares the result of your selector function using === equality, re-rendering only when that specific slice changes."
        },
        retestMcq: {
          id: "q-6.2-1-v2",
          question: "What is the recommended best practice for selector functions passed to useSelector?",
          options: [
            { id: "A", text: "Select only the specific data fields the component actually needs, rather than returning the entire global state object", explanationIfWrong: "Fine-grained selectors minimize unnecessary re-renders." },
            { id: "B", text: "Always return state => state so the component re-renders on all global changes", explanationIfWrong: "Returning global state causes the component to re-render on every unrelated change." },
            { id: "C", text: "Mutate the state object inside the selector function", explanationIfWrong: "Selectors must be pure read-only functions." },
            { id: "D", text: "Make asynchronous API calls inside the selector", explanationIfWrong: "Selectors are synchronous data extractors." }
          ],
          correctAnswer: "A",
          explanationNote: "Extracting only needed data (e.g. state => state.notes.length) avoids re-rendering when unrelated state slices (like state.user or state.filter) change."
        }
      },
      {
        heading: "Dispatching Actions with useDispatch",
        text: "The useDispatch hook returns a reference to the Redux store's dispatch function, allowing components to dispatch actions easily.",
        codeSnippet: `import { useDispatch } from 'react-redux';\nimport { toggleImportanceOf } from '../reducers/noteReducer';\n\nconst Note = ({ note }) => {\n  const dispatch = useDispatch();\n  return (\n    <li>\n      {note.content}\n      <button onClick={() => dispatch(toggleImportanceOf(note.id))}>\n        {note.important ? 'make not important' : 'make important'}\n      </button>\n    </li>\n  );\n};`,
        mcq: {
          id: "q-6.2-2-v1",
          question: "What does the useDispatch() hook return?",
          options: [
            { id: "A", text: "A reference to the Redux store's dispatch function", explanationIfWrong: "useDispatch provides the dispatch function directly into component scope." },
            { id: "B", text: "The entire current state tree of the application", explanationIfWrong: "useSelector reads state; useDispatch provides the dispatch function." },
            { id: "C", text: "An array of all actions dispatched in the last 10 minutes", explanationIfWrong: "It returns the dispatch function, not an action history log." },
            { id: "D", text: "A promise that resolves when the user clicks", explanationIfWrong: "useDispatch returns a synchronous function." }
          ],
          correctAnswer: "A",
          explanationNote: "useDispatch() provides direct access to the store.dispatch function, allowing any component to dispatch actions without prop drilling."
        },
        retestMcq: {
          id: "q-6.2-2-v2",
          question: "Why is useDispatch() more convenient than the legacy connect() higher-order component?",
          options: [
            { id: "A", text: "It is a standard React hook that eliminates complex mapStateToProps/mapDispatchToProps boilerplate and nested wrappers", explanationIfWrong: "Hooks provide a cleaner, flatter, and more readable component structure." },
            { id: "B", text: "Because connect() was banned in modern web browsers", explanationIfWrong: "connect still works, but hooks are the modern standard API." },
            { id: "C", text: "Because useDispatch() does not require a Redux store", explanationIfWrong: "A Redux store is still required." },
            { id: "D", text: "Because connect() cannot dispatch actions", explanationIfWrong: "connect can dispatch actions, but requires verbose boilerplate." }
          ],
          correctAnswer: "A",
          explanationNote: "The useSelector and useDispatch hooks provide a simpler, more intuitive API than the legacy connect HOC, eliminating wrapper boilerplate."
        }
      },
      {
        heading: "Filtering State in Selectors",
        text: "Complex filtering logic can be performed inside useSelector, computing derived views without duplicating state in the store.",
        codeSnippet: `const notes = useSelector(state => {\n  if (state.filter === 'ALL') {\n    return state.notes;\n  }\n  return state.filter === 'IMPORTANT'\n    ? state.notes.filter(n => n.important)\n    : state.notes.filter(n => !n.important);\n});`,
        mcq: {
          id: "q-6.2-3-v1",
          question: "Why should filtered lists be computed in selectors rather than stored as duplicate arrays in Redux state?",
          options: [
            { id: "A", text: "Storing derived data creates redundant state that can easily get out of sync; computing it in selectors ensures single source of truth", explanationIfWrong: "Derived state should always be computed on the fly to avoid synchronization bugs." },
            { id: "B", text: "Because Redux cannot store more than 100 items", explanationIfWrong: "Redux has no practical limit on item counts." },
            { id: "C", text: "Because selectors execute on the backend server", explanationIfWrong: "Selectors execute in browser memory." },
            { id: "D", text: "To increase hard drive storage usage", explanationIfWrong: "Computing derived state saves memory and keeps state clean." }
          ],
          correctAnswer: "A",
          explanationNote: "Maintaining duplicate arrays (e.g. allNotes and filteredNotes) leads to state synchronization bugs. Computing filtered data on the fly guarantees consistency."
        },
        retestMcq: {
          id: "q-6.2-3-v2",
          question: "What happens if a user dispatches a filter change action { type: 'SET_FILTER', payload: 'IMPORTANT' }?",
          options: [
            { id: "A", text: "filterReducer updates state.filter to 'IMPORTANT', and the Notes component re-renders with the newly filtered notes", explanationIfWrong: "The filter state update triggers a re-render with the new computed list." },
            { id: "B", text: "All non-important notes are permanently deleted from MongoDB", explanationIfWrong: "Filtering only affects display, not database persistence." },
            { id: "C", text: "The browser navigates to a new URL", explanationIfWrong: "In-memory state filtering does not alter the URL." },
            { id: "D", text: "The Notes component unmounts and is never rendered again", explanationIfWrong: "The component merely updates its rendered list items." }
          ],
          correctAnswer: "A",
          explanationNote: "Updating state.filter triggers components subscribed to that slice (or derived slice) to re-evaluate and display only the matching items."
        }
      },
      {
        heading: "Decoupling Form Submissions from Redux",
        text: "Form components can manage their own internal input state with useState, and only dispatch Redux actions when the form is submitted.",
        codeSnippet: `const NewNote = () => {\n  const dispatch = useDispatch();\n  const addNote = (event) => {\n    event.preventDefault();\n    const content = event.target.note.value;\n    event.target.note.value = '';\n    dispatch(createNote(content));\n  };\n  return (<form onSubmit={addNote}><input name="note" /><button>add</button></form>);\n};`,
        mcq: {
          id: "q-6.2-4-v1",
          question: "Should every single character typed into a form input be stored in the global Redux store?",
          options: [
            { id: "A", text: "No, transient form input is usually best kept in local component state; store only application-wide data in Redux", explanationIfWrong: "Storing every keystroke in global Redux adds unnecessary overhead and clutter." },
            { id: "B", text: "Yes, Redux documentation requires 100% of all variables to be in Redux", explanationIfWrong: "Redux documentation explicitly recommends local state for transient form data." },
            { id: "C", text: "Yes, because useState was deprecated when React-Redux was created", explanationIfWrong: "useState and Redux complement each other perfectly." },
            { id: "D", text: "No, because Redux cannot store string values", explanationIfWrong: "Redux can store any serializable data type." }
          ],
          correctAnswer: "A",
          explanationNote: "Transient data that only matters to a single component (such as active typing in a form input) belongs in local component state (useState), not global Redux."
        },
        retestMcq: {
          id: "q-6.2-4-v2",
          question: "What is an uncontrolled form input in React?",
          options: [
            { id: "A", text: "An input where the DOM handles form data directly and its value is accessed via event.target or a ref on submit, rather than bound to a useState variable", explanationIfWrong: "Uncontrolled inputs rely on the native DOM to store their values." },
            { id: "B", text: "An input that accepts passwords without encryption", explanationIfWrong: "Uncontrolled refers to state ownership, not security." },
            { id: "C", text: "An input that cannot be clicked by the user", explanationIfWrong: "Uncontrolled inputs function normally for users." },
            { id: "D", text: "An input managed exclusively by backend webhooks", explanationIfWrong: "Uncontrolled inputs are standard HTML inputs." }
          ],
          correctAnswer: "A",
          explanationNote: "Uncontrolled inputs let the DOM maintain form state internally, reading values only when needed (e.g. event.target.note.value on submit)."
        }
      },
      {
        heading: "Presentational vs Container Components",
        text: "Separating presentational components (pure UI with props) from container components (hooks and Redux dispatches) increases reusability.",
        codeSnippet: `// Presentational: Knows nothing about Redux\nconst Note = ({ note, handleClick }) => (\n  <li onClick={handleClick}>{note.content}</li>\n);\n\n// Container: Connects to Redux & passes props\nconst Notes = () => {\n  const dispatch = useDispatch();\n  const notes = useSelector(state => state.notes);\n  return notes.map(n => <Note key={n.id} note={n} handleClick={() => dispatch(toggle(n.id))} />);\n};`,
        mcq: {
          id: "q-6.2-5-v1",
          question: "What is the primary advantage of presentational components that only accept props and callbacks?",
          options: [
            { id: "A", text: "They are completely decoupled from state libraries, making them easy to reuse, style, and unit-test in isolation", explanationIfWrong: "Pure presentational components are lightweight and highly reusable." },
            { id: "B", text: "They execute 10 times faster in the browser GPU", explanationIfWrong: "Separation is an architectural pattern, not a hardware GPU optimization." },
            { id: "C", text: "They prevent developers from having to install npm packages", explanationIfWrong: "Component organization does not eliminate npm dependencies." },
            { id: "D", text: "They automatically translate into native iOS views", explanationIfWrong: "React components render to web DOM." }
          ],
          correctAnswer: "A",
          explanationNote: "Presentational components receive data and callbacks purely via props, making them simple, reusable across different apps, and trivial to unit-test."
        },
        retestMcq: {
          id: "q-6.2-5-v2",
          question: "Which component in the snippet above is responsible for coordinating with the Redux store?",
          options: [
            { id: "A", text: "The Notes container component", explanationIfWrong: "Notes calls useSelector and useDispatch, connecting domain logic to the UI." },
            { id: "B", text: "The Note presentational component", explanationIfWrong: "Note is pure presentational and knows nothing of Redux." },
            { id: "C", text: "The browser's window object", explanationIfWrong: "The container component manages store coordination." },
            { id: "D", text: "The database server", explanationIfWrong: "Redux operates inside the client React runtime." }
          ],
          correctAnswer: "A",
          explanationNote: "The container component (Notes) connects to Redux via hooks, extracts state, and passes plain data and callbacks down to presentational components (Note)."
        }
      }
    ]
  },
  {
    id: "6-3-redux-toolkit-createslice",
    number: "6.3",
    title: "Redux Toolkit & createSlice",
    subtitle: "Modernize Redux using @reduxjs/toolkit: createSlice, configureStore, automatic action creators, and mutable-syntax updates with Immer.",
    readTime: "13 min",
    objectives: [
      "Simplify Redux setup using the official @reduxjs/toolkit package",
      "Configure store with configureStore() including built-in DevTools and thunk middleware",
      "Define state slices with createSlice combining actions and reducers in one file",
      "Write 'mutating' state logic safely thanks to Immer's copy-on-write under the hood",
      "Export auto-generated action creators directly from slice.actions",
      "Inspect and debug application state changes with Redux DevTools"
    ],
    theoryBlocks: [
      {
        heading: "The Motivation for Redux Toolkit (RTK)",
        text: "Redux Toolkit is the official, opinionated standard that eliminates traditional boilerplate (action types, action creators, manual immutability, and store setup).",
        codeSnippet: `// Terminal installation:\nnpm install @reduxjs/toolkit react-redux`,
        mcq: {
          id: "q-6.3-0-v1",
          question: "Why was Redux Toolkit (RTK) introduced as the official standard for writing Redux logic?",
          options: [
            { id: "A", text: "To eliminate common complaints about classic Redux: excessive boilerplate, complicated store setup, and manual immutability management", explanationIfWrong: "RTK dramatically streamlines Redux development with sensible defaults." },
            { id: "B", text: "Because classic Redux was deleted from the npm registry", explanationIfWrong: "Classic Redux still exists, but RTK is the modern recommended approach." },
            { id: "C", text: "To replace React with Vue.js", explanationIfWrong: "RTK is built specifically for modern Redux and works seamlessly with React." },
            { id: "D", text: "To force all applications to use GraphQL", explanationIfWrong: "RTK works with standard REST APIs, WebSockets, or any backend." }
          ],
          correctAnswer: "A",
          explanationNote: "Redux Toolkit was created to solve classic Redux pain points: reducing boilerplate, providing built-in Immer for safe mutations, and simplifying store configuration."
        },
        retestMcq: {
          id: "q-6.3-0-v2",
          question: "Which package should you install to build modern Redux applications today?",
          options: [
            { id: "A", text: "@reduxjs/toolkit", explanationIfWrong: "@reduxjs/toolkit is the official package containing all modern Redux utilities." },
            { id: "B", text: "redux-legacy-boilerplate", explanationIfWrong: "This is not a real Redux package." },
            { id: "C", text: "jquery-redux", explanationIfWrong: "Redux is not tied to jQuery." },
            { id: "D", text: "react-flux-old", explanationIfWrong: "The modern standard is @reduxjs/toolkit." }
          ],
          correctAnswer: "A",
          explanationNote: "@reduxjs/toolkit is the modern official package that includes Redux core, Immer, Redux Thunk, and configureStore out of the box."
        }
      },
      {
        heading: "Defining Slices with createSlice",
        text: "createSlice accepts a name, initialState, and an object of reducer functions, automatically generating action creators and action types.",
        codeSnippet: `import { createSlice } from '@reduxjs/toolkit';\n\nconst noteSlice = createSlice({\n  name: 'notes',\n  initialState: [],\n  reducers: {\n    createNote(state, action) {\n      state.push(action.payload);\n    },\n    toggleImportanceOf(state, action) {\n      const id = action.payload;\n      const note = state.find(n => n.id === id);\n      if (note) note.important = !note.important;\n    }\n  }\n});\nexport const { createNote, toggleImportanceOf } = noteSlice.actions;\nexport default noteSlice.reducer;`,
        mcq: {
          id: "q-6.3-1-v1",
          question: "How does createSlice simplify writing action creators?",
          options: [
            { id: "A", text: "It automatically generates action creator functions corresponding to each reducer key in slice.actions", explanationIfWrong: "createSlice generates action creators with matching type strings automatically." },
            { id: "B", text: "It asks the developer to write manual action creators in a separate file", explanationIfWrong: "RTK eliminates manual action creator boilerplate." },
            { id: "C", text: "It converts all action creators into promises", explanationIfWrong: "Standard slice action creators are synchronous functions." },
            { id: "D", text: "It deletes the reducer after one call", explanationIfWrong: "Reducers remain active for the life of the app." }
          ],
          correctAnswer: "A",
          explanationNote: "createSlice generates action creator functions whose types are automatically prefixed with the slice name (e.g. 'notes/createNote')."
        },
        retestMcq: {
          id: "q-6.3-1-v2",
          question: "What is the auto-generated action type string for the toggleImportanceOf reducer in the 'notes' slice above?",
          options: [
            { id: "A", text: "'notes/toggleImportanceOf'", explanationIfWrong: "RTK formats types as `${name}/${reducerKey}`." },
            { id: "B", text: "'TOGGLE_IMPORTANCE_OF_GLOBAL'", explanationIfWrong: "RTK uses namespaced lowercase/camelCase strings." },
            { id: "C", text: "'action_12345'", explanationIfWrong: "RTK generates readable, predictable action types." },
            { id: "D", text: "'undefined'", explanationIfWrong: "RTK assigns a clean namespaced string." }
          ],
          correctAnswer: "A",
          explanationNote: "Redux Toolkit automatically creates action types using the slice name and reducer name: `${name}/${reducerName}` (e.g. 'notes/toggleImportanceOf')."
        }
      },
      {
        heading: "Safe Mutable Syntax via Immer",
        text: "Inside createSlice reducers, you can write mutating code like state.push() or note.important = !note.important because Immer intercepts changes and produces an immutable copy.",
        codeSnippet: `// Inside createSlice, this is 100% SAFE:\ncreateNote(state, action) {\n  state.push(action.payload); // Immer handles immutability behind the scenes!\n}`,
        mcq: {
          id: "q-6.3-2-v1",
          question: "Why is calling state.push() safe inside a createSlice reducer, whereas it was prohibited in classic Redux?",
          options: [
            { id: "A", text: "createSlice uses the Immer library internally, which records mutations on a draft object and safely produces a new immutable state tree", explanationIfWrong: "Immer detects mutations on draft proxies and creates frozen immutable updates." },
            { id: "B", text: "Because modern browsers no longer require immutability", explanationIfWrong: "React and Redux still strictly require immutable state updates." },
            { id: "C", text: "Because state.push() only modifies numbers", explanationIfWrong: "push operates on any array element." },
            { id: "D", text: "Because Redux Toolkit disabled the virtual DOM", explanationIfWrong: "React's virtual DOM relies on immutability." }
          ],
          correctAnswer: "A",
          explanationNote: "Immer wraps the state in a proxy 'draft'. You can write intuitive mutating syntax (e.g. push), and Immer produces a brand new immutable state object under the hood."
        },
        retestMcq: {
          id: "q-6.3-2-v2",
          question: "In an Immer-powered createSlice reducer, what critical rule must you follow regarding mutating vs returning?",
          options: [
            { id: "A", text: "You must either mutate the draft state OR return a new state object, but never do both in the same reducer", explanationIfWrong: "Mixing draft mutation with a return statement confuses Immer." },
            { id: "B", text: "You must always call window.alert() before returning", explanationIfWrong: "Reducers must remain pure functions." },
            { id: "C", text: "You must return undefined", explanationIfWrong: "If mutating, returning nothing (undefined) allows Immer to produce the draft." },
            { id: "D", text: "You can only use while loops", explanationIfWrong: "Any standard JavaScript logic is permissible." }
          ],
          correctAnswer: "A",
          explanationNote: "With Immer, you either mutate the draft directly (and return nothing) or return a brand-new value (e.g. return state.filter(...)). Never do both simultaneously."
        }
      },
      {
        heading: "Store Setup with configureStore",
        text: "configureStore replaces createStore, automatically combining slice reducers and pre-configuring Redux Thunk and Redux DevTools extension support.",
        codeSnippet: `import { configureStore } from '@reduxjs/toolkit';\nimport noteReducer from './reducers/noteReducer';\nimport filterReducer from './reducers/filterReducer';\n\nconst store = configureStore({\n  reducer: {\n    notes: noteReducer,\n    filter: filterReducer\n  }\n});\nexport default store;`,
        mcq: {
          id: "q-6.3-3-v1",
          question: "What capabilities are enabled automatically when creating a store with configureStore()?",
          options: [
            { id: "A", text: "Redux Thunk middleware for async actions, Redux DevTools browser extension integration, and development checks for accidental state mutations", explanationIfWrong: "configureStore configures industry-standard middleware and tooling automatically." },
            { id: "B", text: "Direct connections to MongoDB Atlas without a server", explanationIfWrong: "Stores run in browser memory and do not connect directly to databases." },
            { id: "C", text: "Automatic deployment of the website to Vercel", explanationIfWrong: "configureStore is a runtime JavaScript library, not a deployment service." },
            { id: "D", text: "Converting React components to Angular components", explanationIfWrong: "Redux Toolkit works seamlessly with React." }
          ],
          correctAnswer: "A",
          explanationNote: "configureStore() bundles redux-thunk, Redux DevTools extension support, and development immutability/serializability warning checks automatically."
        },
        retestMcq: {
          id: "q-6.3-3-v2",
          question: "How do you define multiple slice reducers in configureStore?",
          options: [
            { id: "A", text: "Pass an object to the 'reducer' property: { reducer: { notes: noteReducer, filter: filterReducer } }", explanationIfWrong: "configureStore automatically calls combineReducers on the object." },
            { id: "B", text: "Chain store.addReducer() calls sequentially", explanationIfWrong: "configureStore takes a single configuration object with a reducer field." },
            { id: "C", text: "Pass reducers as comma-separated function arguments", explanationIfWrong: "configureStore expects an options object." },
            { id: "D", text: "Declare reducers in index.html", explanationIfWrong: "Redux is configured in JavaScript files." }
          ],
          correctAnswer: "A",
          explanationNote: "Passing an object of slice reducers to configureStore({ reducer: { notes, filter } }) automatically invokes combineReducers behind the scenes."
        }
      },
      {
        heading: "Redux DevTools Integration",
        text: "The Redux DevTools browser extension allows developers to inspect action history, view state diffs, and perform 'time-travel' debugging.",
        codeSnippet: `// With configureStore, Redux DevTools is automatically active!\n// Open Browser DevTools -> 'Redux' tab:\n// - Inspect action types & payloads\n// - Jump back and forth in state history ('Time Travel')\n// - Replay actions`,
        mcq: {
          id: "q-6.3-4-v1",
          question: "What is 'time-travel debugging' in the Redux DevTools extension?",
          options: [
            { id: "A", text: "The ability to step backwards and forwards through dispatched actions, re-evaluating the application UI at any previous state in time", explanationIfWrong: "Time-travel debugging lets developers jump to any past state in history." },
            { id: "B", text: "Changing the system clock of the server", explanationIfWrong: "It steps through action history in browser memory, not server clocks." },
            { id: "C", text: "Scheduling emails to be sent next week", explanationIfWrong: "Time travel is an interactive debugging feature." },
            { id: "D", text: "Speeding up video playback", explanationIfWrong: "It is a state history inspection tool." }
          ],
          correctAnswer: "A",
          explanationNote: "Because state updates are calculated purely from an initial state and action list, Redux DevTools can replay or skip actions to jump to any past UI state."
        },
        retestMcq: {
          id: "q-6.3-4-v2",
          question: "Why does storing non-serializable values (like functions, Promises, or DOM nodes) in Redux break DevTools?",
          options: [
            { id: "A", text: "DevTools serializes actions and state to JSON to display diffs and persist history; non-serializable values cannot be cleanly serialized or replayed", explanationIfWrong: "Redux requires actions and state to be plain serializable JSON objects." },
            { id: "B", text: "Because non-serializable values trigger an immediate operating system crash", explanationIfWrong: "It breaks serialization, time-travel, and persistence." },
            { id: "C", text: "Because browsers only allow numbers in memory", explanationIfWrong: "Browsers support all JavaScript types, but Redux requires serializable state." },
            { id: "D", text: "Because React forbids functions", explanationIfWrong: "React uses functions everywhere; Redux state specifically needs serializable data." }
          ],
          correctAnswer: "A",
          explanationNote: "Redux state and actions should be plain serializable objects so that DevTools, logging, and state hydration can serialize, inspect, and replay them."
        }
      },
      {
        heading: "Writing Clean Notification Slices",
        text: "A notification slice provides a clean message state that can be set and cleared by action creators across the entire application.",
        codeSnippet: `const notificationSlice = createSlice({\n  name: 'notification',\n  initialState: null,\n  reducers: {\n    setNotification(state, action) {\n      return action.payload;\n    },\n    clearNotification() {\n      return null;\n    }\n  }\n});\nexport const { setNotification, clearNotification } = notificationSlice.actions;\nexport default notificationSlice.reducer;`,
        mcq: {
          id: "q-6.3-5-v1",
          question: "In the notification slice above, why does clearNotification() simply 'return null'?",
          options: [
            { id: "A", text: "Returning null replaces the current state with null, causing the UI notification banner to unmount or hide", explanationIfWrong: "Returning null sets the slice state back to its empty initial value." },
            { id: "B", text: "Because reducers cannot return strings", explanationIfWrong: "Reducers can return strings, numbers, objects, or null." },
            { id: "C", text: "To prevent the user from clicking buttons", explanationIfWrong: "It only resets notification state." },
            { id: "D", text: "To clear the database", explanationIfWrong: "It only modifies client Redux state." }
          ],
          correctAnswer: "A",
          explanationNote: "Returning null replaces the notification text with null, allowing conditional rendering ({notification && <Banner />}) to hide the notification."
        },
        retestMcq: {
          id: "q-6.3-5-v2",
          question: "How can any component in the application read the active notification message?",
          options: [
            { id: "A", text: "const notification = useSelector(state => state.notification);", explanationIfWrong: "useSelector reads the current notification value from the store." },
            { id: "B", text: "const notification = window.notification;", explanationIfWrong: "Global window variables are not reactive Redux state." },
            { id: "C", text: "const notification = document.getElementById('notification').text;", explanationIfWrong: "React components use hooks, not manual DOM element scraping." },
            { id: "D", text: "const notification = useNotificationDatabase();", explanationIfWrong: "useSelector is the standard Redux hook." }
          ],
          correctAnswer: "A",
          explanationNote: "Any component can read state.notification using useSelector(state => state.notification), reacting instantly when new notifications are set."
        }
      }
    ]
  },
  {
    id: "6-4-redux-thunk-async-actions",
    number: "6.4",
    title: "Asynchronous Actions & Redux Thunk",
    subtitle: "Coordinate backend communication using Redux Thunk, dispatch asynchronous actions, initialize state from APIs, and auto-clear notifications.",
    readTime: "13 min",
    objectives: [
      "Understand why Redux reducers cannot execute asynchronous side-effects directly",
      "Learn what a 'Thunk' is: an action creator that returns an async function",
      "Dispatch asynchronous thunks using Redux dispatch",
      "Initialize state from a backend server using initializeNotes() thunk",
      "Create and persist new resources asynchronously using createNote() thunk",
      "Implement self-clearing notification thunks using setTimeout"
    ],
    theoryBlocks: [
      {
        heading: "Why Reducers Cannot Be Asynchronous",
        text: "Reducers must remain pure, synchronous functions; asynchronous operations like Axios HTTP calls must be handled outside reducers using Redux Thunk.",
        codeSnippet: `// ❌ NEVER DO THIS (Reducers MUST be synchronous):\nreducers: {\n  async getNotes(state) {\n    const notes = await axios.get('/api/notes'); // BANNED IN REDUCERS!\n  }\n}`,
        mcq: {
          id: "q-6.4-0-v1",
          question: "Why are asynchronous calls (like await axios.get) strictly forbidden inside Redux reducers?",
          options: [
            { id: "A", text: "Reducers must be pure, deterministic synchronous functions to calculate the next state immediately and preserve time-travel debuggability", explanationIfWrong: "Asynchronous operations break the synchronous determinism required by Redux." },
            { id: "B", text: "Because browsers block HTTP requests inside JavaScript functions", explanationIfWrong: "Browsers execute HTTP calls anywhere; Redux design requires pure synchronous reducers." },
            { id: "C", text: "Because Axios only works in Node.js backend files", explanationIfWrong: "Axios works in browsers and Node.js." },
            { id: "D", text: "Because MongoDB Atlas does not support Redux", explanationIfWrong: "MongoDB is an external database, completely separate from Redux reducer rules." }
          ],
          correctAnswer: "A",
          explanationNote: "Redux architecture mandates pure, synchronous reducers. Side effects and async operations must happen before actions reach the reducer (e.g. in Thunks)."
        },
        retestMcq: {
          id: "q-6.4-0-v2",
          question: "What middleware included by default in configureStore allows dispatching asynchronous operations?",
          options: [
            { id: "A", text: "redux-thunk", explanationIfWrong: "redux-thunk is the standard middleware for asynchronous action dispatching." },
            { id: "B", text: "redux-flash", explanationIfWrong: "This is not a standard async middleware." },
            { id: "C", text: "express-router", explanationIfWrong: "Express router is backend routing middleware, not a Redux store middleware." },
            { id: "D", text: "cors-headers", explanationIfWrong: "CORS is an HTTP security protocol, not Redux middleware." }
          ],
          correctAnswer: "A",
          explanationNote: "configureStore automatically includes redux-thunk, which intercepts functions passed to dispatch and executes them with (dispatch, getState)."
        }
      },
      {
        heading: "What is a Redux Thunk?",
        text: "A thunk is an action creator that returns an asynchronous function (dispatch, getState) => { ... } instead of a plain action object.",
        codeSnippet: `export const initializeNotes = () => {\n  return async dispatch => {\n    const notes = await noteService.getAll();\n    dispatch(setNotes(notes));\n  };\n};\n\n// In component:\nuseEffect(() => {\n  dispatch(initializeNotes());\n}, [dispatch]);`,
        mcq: {
          id: "q-6.4-1-v1",
          question: "How does Redux Thunk middleware handle an action creator that returns an async function instead of a plain object?",
          options: [
            { id: "A", text: "It intercepts the function, executes it, and passes 'dispatch' and 'getState' as arguments so it can perform async tasks and dispatch actions when ready", explanationIfWrong: "Thunk middleware recognizes functions and executes them with dispatch." },
            { id: "B", text: "It throws a TypeError: actions must be plain objects", explanationIfWrong: "Without thunk it throws, but redux-thunk intercepts and handles functions." },
            { id: "C", text: "It converts the function into an HTML string", explanationIfWrong: "Thunks execute JavaScript code; they do not generate HTML." },
            { id: "D", text: "It logs the user out of the application", explanationIfWrong: "Thunks enable asynchronous workflows like data fetching." }
          ],
          correctAnswer: "A",
          explanationNote: "When redux-thunk sees a function passed to store.dispatch(), it calls that function with (dispatch, getState), allowing it to await asynchronous calls before dispatching."
        },
        retestMcq: {
          id: "q-6.4-1-v2",
          question: "In the initializeNotes thunk above, what happens once noteService.getAll() resolves?",
          options: [
            { id: "A", text: "The thunk dispatches the synchronous action setNotes(notes), updating the Redux store with the fetched data", explanationIfWrong: "The async thunk fetches data and then dispatches the regular synchronous action." },
            { id: "B", text: "The server restarts automatically", explanationIfWrong: "Fetching data does not restart servers." },
            { id: "C", text: "The browser deletes the database collections", explanationIfWrong: "Fetching data is a read-only GET operation." },
            { id: "D", text: "The Redux store is destroyed", explanationIfWrong: "The store receives the data and updates state." }
          ],
          correctAnswer: "A",
          explanationNote: "Once the asynchronous network call finishes, the thunk calls dispatch(setNotes(notes)) to populate the Redux store with the retrieved notes."
        }
      },
      {
        heading: "Asynchronous Resource Creation",
        text: "Thunks encapsulate both server communication and store dispatch, keeping React components clean and focused purely on UI rendering.",
        codeSnippet: `export const createNote = content => {\n  return async dispatch => {\n    const newNote = await noteService.create({ content, important: false });\n    dispatch(appendNote(newNote));\n  };\n};\n\n// In Form component (Simple & Clean!):\nconst addNote = (event) => {\n  event.preventDefault();\n  dispatch(createNote(content));\n};`,
        mcq: {
          id: "q-6.4-2-v1",
          question: "Why is it beneficial to encapsulate API calls inside thunks rather than inside component event handlers?",
          options: [
            { id: "A", text: "Components become simpler and purely UI-focused, while data fetching and state synchronization logic is reusable and centralized in the slice", explanationIfWrong: "Encapsulating network calls in thunks improves separation of concerns." },
            { id: "B", text: "Because React does not allow async/await inside event handlers", explanationIfWrong: "Event handlers can use async/await, but delegating to thunks organizes architecture." },
            { id: "C", text: "To prevent the browser from caching CSS", explanationIfWrong: "Thunks manage state and API communication, not CSS caching." },
            { id: "D", text: "Because thunks run on a separate computer", explanationIfWrong: "Thunks run in the client browser JavaScript thread." }
          ],
          correctAnswer: "A",
          explanationNote: "Extracting backend communication into thunks decouples UI components from API service details, making components cleaner, easier to test, and more maintainable."
        },
        retestMcq: {
          id: "q-6.4-2-v2",
          question: "What does dispatch(appendNote(newNote)) do after noteService.create() returns?",
          options: [
            { id: "A", text: "It dispatches an action to the noteReducer, which appends the newly created note into the Redux store array", explanationIfWrong: "appendNote adds the server-confirmed note into client state." },
            { id: "B", text: "It re-submits the form a second time", explanationIfWrong: "It updates the store; it does not re-submit forms." },
            { id: "C", text: "It clears the entire database", explanationIfWrong: "It merely updates the client Redux store." },
            { id: "D", text: "It logs out the current user", explanationIfWrong: "Creating a note preserves user session." }
          ],
          correctAnswer: "A",
          explanationNote: "appendNote updates the Redux store state with the newly created note object (including its server-generated ID), causing the UI to display it immediately."
        }
      },
      {
        heading: "Self-Dismissing Notification Thunk",
        text: "A thunk can dispatch a message, schedule a timeout, and dispatch a clear action after the delay, providing an elegant one-line notification API.",
        codeSnippet: `export const setNotificationWithTimeout = (message, seconds) => {\n  return async dispatch => {\n    dispatch(setNotification(message));\n    setTimeout(() => {\n      dispatch(clearNotification());\n    }, seconds * 1000);\n  };\n};\n\n// Usage in any component:\ndispatch(setNotificationWithTimeout('Note created successfully!', 5));`,
        mcq: {
          id: "q-6.4-3-v1",
          question: "How does setNotificationWithTimeout simplify displaying temporary notifications across an application?",
          options: [
            { id: "A", text: "A single dispatch sets the message and automatically schedules its clearance after the specified duration, without any timer logic in components", explanationIfWrong: "The thunk encapsulates the entire lifecycle of the timed notification." },
            { id: "B", text: "It forces the user to wait 5 seconds before clicking anything else", explanationIfWrong: "setTimeout is non-blocking; the user continues using the app." },
            { id: "C", text: "It sends an SMS to the user's mobile phone", explanationIfWrong: "It merely controls a UI banner inside the browser." },
            { id: "D", text: "It converts the notification into a PDF", explanationIfWrong: "It manages temporary client notification state." }
          ],
          correctAnswer: "A",
          explanationNote: "Encapsulating setTimeout in a thunk provides a clean, declarative one-liner (dispatch(setNotificationWithTimeout(msg, 5))) that handles creation and cleanup."
        },
        retestMcq: {
          id: "q-6.4-3-v2",
          question: "What subtle bug can occur if a second notification is dispatched before the first notification's 5-second timer expires?",
          options: [
            { id: "A", text: "The first timer might expire and prematurely clear the second notification before its own 5 seconds have elapsed", explanationIfWrong: "Overlapping timers can cause earlier timers to clear newer messages prematurely." },
            { id: "B", text: "The browser crashes with a stack overflow", explanationIfWrong: "Multiple timeouts are easily handled by browsers; the issue is timer coordination." },
            { id: "C", text: "The text becomes permanently bold", explanationIfWrong: "It is a timing logic issue, not a typography issue." },
            { id: "D", text: "Redux deletes all reducers", explanationIfWrong: "Redux reducers are never deleted by timeouts." }
          ],
          correctAnswer: "A",
          explanationNote: "If overlapping timers run, the first timer may call clearNotification() early, extinguishing the second message. Tracking the active timeout ID resolves this."
        }
      },
      {
        heading: "Handling API Errors in Thunks",
        text: "Thunks can wrap API calls in try/catch blocks, dispatching failure notifications or error actions when backend requests fail.",
        codeSnippet: `export const createNote = content => {\n  return async dispatch => {\n    try {\n      const newNote = await noteService.create({ content, important: false });\n      dispatch(appendNote(newNote));\n      dispatch(setNotificationWithTimeout(\`Added '\${content}'\`, 5));\n    } catch (error) {\n      dispatch(setNotificationWithTimeout('Failed to save note to server', 5));\n    }\n  };\n};`,
        mcq: {
          id: "q-6.4-4-v1",
          question: "How does wrapping the API call inside try/catch in the thunk benefit the application?",
          options: [
            { id: "A", text: "It catches backend network or validation errors and dispatches informative error notifications to the user without crashing the UI", explanationIfWrong: "Graceful error handling provides feedback to the user on failures." },
            { id: "B", text: "It forces the server to accept invalid data", explanationIfWrong: "try/catch cannot force the server to accept bad data." },
            { id: "C", text: "It automatically creates an account on GitHub", explanationIfWrong: "try/catch is a standard JavaScript error handling construct." },
            { id: "D", text: "It prevents any further actions from ever being dispatched", explanationIfWrong: "The application continues running normally." }
          ],
          correctAnswer: "A",
          explanationNote: "Wrapping async API calls in try/catch enables the thunk to handle network and HTTP error responses gracefully by alerting the user through the notification slice."
        },
        retestMcq: {
          id: "q-6.4-4-v2",
          question: "If an API call fails with status 500, what happens in the thunk above?",
          options: [
            { id: "A", text: "Execution jumps to the catch block and dispatches an error notification: 'Failed to save note to server'", explanationIfWrong: "Axios throws on 500 status codes, triggering the catch block." },
            { id: "B", text: "appendNote is called with an empty object", explanationIfWrong: "Execution jumps to catch; appendNote is skipped." },
            { id: "C", text: "The entire web page turns white", explanationIfWrong: "The error is caught gracefully, preventing UI crashes." },
            { id: "D", text: "The user is automatically logged out", explanationIfWrong: "Status 500 is a server error, not an authentication failure (401)." }
          ],
          correctAnswer: "A",
          explanationNote: "Axios rejects promises on 500 responses. The catch block intercepts this rejection and dispatches a friendly error notification to the user."
        }
      },
      {
        heading: "Full Stack Open State Management Architecture",
        text: "Separating API services, Redux slice reducers, async thunks, and presentational UI components establishes enterprise-grade architecture.",
        codeSnippet: `// Complete Redux Architecture:\n// 1. services/notes.js: Raw Axios HTTP requests\n// 2. reducers/noteReducer.js: createSlice + Async Thunks\n// 3. store.js: configureStore({ reducer: { notes, filter, notification } })\n// 4. components/: Pure UI and custom hooks using useSelector / useDispatch`,
        mcq: {
          id: "q-6.4-5-v1",
          question: "In this architecture, which module is solely responsible for sending HTTP requests to the backend server?",
          options: [
            { id: "A", text: "The service module (e.g. services/notes.js)", explanationIfWrong: "The service module encapsulates all HTTP communication." },
            { id: "B", text: "The React presentational component", explanationIfWrong: "Components should only render UI and handle user input." },
            { id: "C", text: "The index.html file", explanationIfWrong: "HTML files define structure, not application networking." },
            { id: "D", text: "The Redux reducer switch statement", explanationIfWrong: "Reducers must remain pure, synchronous calculation functions." }
          ],
          correctAnswer: "A",
          explanationNote: "Dedicated service modules (e.g. services/notes.js) isolate network communication, keeping HTTP endpoints and header configurations centralized."
        },
        retestMcq: {
          id: "q-6.4-5-v2",
          question: "What is the primary role of the Redux store in this full stack architecture?",
          options: [
            { id: "A", text: "To act as the single source of truth for client-side application state, ensuring all components have access to synchronized data", explanationIfWrong: "The store holds the central, synchronized state tree for the frontend." },
            { id: "B", text: "To replace the backend MongoDB database", explanationIfWrong: "Redux is an in-memory client state store, not a persistent database." },
            { id: "C", text: "To compile CSS styles into bytecode", explanationIfWrong: "Redux manages data, not styles." },
            { id: "D", text: "To host the production website", explanationIfWrong: "Redux is a JavaScript library inside the frontend app." }
          ],
          correctAnswer: "A",
          explanationNote: "The Redux store serves as the single source of truth for global client state, ensuring all connected components reflect consistent, synchronized data."
        }
      }
    ]
  },
  {
    id: "6-5-react-query-server-state",
    number: "6.5",
    title: "React Query: Server State vs Client State",
    subtitle: "Simplify server data synchronization using TanStack Query (React Query), manage caching, mutations, and query invalidation.",
    readTime: "13 min",
    objectives: [
      "Distinguish between client state (UI state) and server state (cached remote data)",
      "Set up TanStack Query using QueryClient and QueryClientProvider",
      "Fetch and cache server data with the useQuery hook",
      "Execute data mutations (POST, PUT, DELETE) using the useMutation hook",
      "Invalidate and re-fetch cached queries with queryClient.invalidateQueries()",
      "Handle loading, error, and success states declaratively"
    ],
    theoryBlocks: [
      {
        heading: "Server State vs Client State",
        text: "Client state is local, synchronous data like open modals or form inputs; server state is asynchronous, remotely owned data that requires caching and synchronization.",
        codeSnippet: `// Client State: Filter selection, modal visibility, form drafts (useState/Redux)\n// Server State: Notes array, user profile fetched from DB (React Query)`,
        mcq: {
          id: "q-6.5-0-v1",
          question: "Why is server data fundamentally different from client UI state?",
          options: [
            { id: "A", text: "Server state is remotely owned, persisted outside the browser, asynchronous to fetch, and can become out of date if another user modifies it", explanationIfWrong: "Server state requires caching, refetching, and synchronization strategies." },
            { id: "B", text: "Server state can only contain strings", explanationIfWrong: "Server state can be any structured JSON data." },
            { id: "C", text: "Client state is automatically saved to MongoDB Atlas", explanationIfWrong: "Client state lives in browser memory unless explicitly sent to the server." },
            { id: "D", text: "Server state does not require internet access", explanationIfWrong: "Server state requires network communication." }
          ],
          correctAnswer: "A",
          explanationNote: "Server state is asynchronous, shared, and can change independently of the local user. Tools like TanStack Query specialize in managing its caching and re-fetching."
        },
        retestMcq: {
          id: "q-6.5-0-v2",
          question: "Which tool is purpose-built specifically for managing server state caching, background refetching, and mutations?",
          options: [
            { id: "A", text: "TanStack Query (React Query)", explanationIfWrong: "TanStack Query is the industry standard for managing server state." },
            { id: "B", text: "jQuery DOM selector", explanationIfWrong: "jQuery is an imperative DOM manipulation library." },
            { id: "C", text: "CSS Flexbox", explanationIfWrong: "Flexbox is a CSS layout mechanism." },
            { id: "D", text: "Babel compiler", explanationIfWrong: "Babel transpiles modern JavaScript to older versions." }
          ],
          correctAnswer: "A",
          explanationNote: "TanStack Query (formerly React Query) eliminates thousands of lines of boilerplate by handling caching, deduping, background updating, and mutations out of the box."
        }
      },
      {
        heading: "Fetching with useQuery",
        text: "useQuery takes a queryKey and a queryFn; it automatically manages loading, error, and data states, caching the result in memory.",
        codeSnippet: `import { useQuery } from '@tanstack/react-query';\nimport { getNotes } from '../requests';\n\nconst App = () => {\n  const result = useQuery({\n    queryKey: ['notes'],\n    queryFn: getNotes,\n    retry: 1\n  });\n\n  if (result.isLoading) return <div>Loading data...</div>;\n  if (result.isError) return <div>Note service not available</div>;\n  const notes = result.data;\n  // render notes...\n};`,
        mcq: {
          id: "q-6.5-1-v1",
          question: "What does the queryKey array (e.g. ['notes']) do in React Query?",
          options: [
            { id: "A", text: "It acts as a unique cache key used to identify, cache, and invalidate that specific query across the application", explanationIfWrong: "The queryKey uniquely identifies cached query results." },
            { id: "B", text: "It specifies the password needed to decrypt the data", explanationIfWrong: "queryKey is a cache lookup key, not an encryption password." },
            { id: "C", text: "It sets the name of the database table in MongoDB", explanationIfWrong: "MongoDB collection names are defined in backend Mongoose models." },
            { id: "D", text: "It tells the browser which tab to open", explanationIfWrong: "queryKey is purely an in-memory cache identifier." }
          ],
          correctAnswer: "A",
          explanationNote: "The queryKey uniquely identifies the query in React Query's cache. Anytime the same key is requested, React Query can return cached data and revalidate in the background."
        },
        retestMcq: {
          id: "q-6.5-1-v2",
          question: "What properties does the object returned by useQuery provide to handle loading and error states cleanly?",
          options: [
            { id: "A", text: "isLoading, isError, data, and error", explanationIfWrong: "useQuery provides declarative boolean flags and data/error objects." },
            { id: "B", text: "only a single raw Promise object", explanationIfWrong: "useQuery abstracts promises into reactive state flags." },
            { id: "C", text: "window.location and document.body", explanationIfWrong: "useQuery returns query state, not browser window objects." },
            { id: "D", text: "an encrypted JWT token", explanationIfWrong: "It provides query metadata: isLoading, isError, data, etc." }
          ],
          correctAnswer: "A",
          explanationNote: "useQuery provides intuitive state flags (isLoading, isError, isSuccess) and data/error properties, eliminating the need to manually manage loading booleans."
        }
      },
      {
        heading: "Mutations with useMutation",
        text: "The useMutation hook executes data mutations (creating, updating, deleting) on the server and provides onSuccess callbacks to invalidate queries.",
        codeSnippet: `import { useMutation, useQueryClient } from '@tanstack/react-query';\n\nconst queryClient = useQueryClient();\nconst newNoteMutation = useMutation({\n  mutationFn: createNote,\n  onSuccess: () => {\n    queryClient.invalidateQueries({ queryKey: ['notes'] });\n  }\n});\n\n// Trigger mutation:\nnewNoteMutation.mutate({ content, important: false });`,
        mcq: {
          id: "q-6.5-2-v1",
          question: "What does queryClient.invalidateQueries({ queryKey: ['notes'] }) do inside the mutation's onSuccess callback?",
          options: [
            { id: "A", text: "It marks the cached 'notes' data as stale and automatically triggers a background refetch, keeping the UI perfectly synchronized with the server", explanationIfWrong: "Invalidation marks data stale, prompting an immediate refetch." },
            { id: "B", text: "It deletes the notes database collection permanently", explanationIfWrong: "It invalidates client cache, not server databases." },
            { id: "C", text: "It closes the browser window", explanationIfWrong: "It is an internal cache management call." },
            { id: "D", text: "It logs the user out", explanationIfWrong: "User session remains unaffected." }
          ],
          correctAnswer: "A",
          explanationNote: "Invalidating the query marks cached data as outdated and immediately refetches it from the server, ensuring the UI reflects the mutation without manual state updates."
        },
        retestMcq: {
          id: "q-6.5-2-v2",
          question: "How do you trigger a mutation defined with const myMutation = useMutation({ mutationFn })?",
          options: [
            { id: "A", text: "myMutation.mutate(payload)", explanationIfWrong: ".mutate(variables) triggers the execution of the mutationFn with the supplied payload." },
            { id: "B", text: "myMutation.run()", explanationIfWrong: "The method is .mutate(), not .run()." },
            { id: "C", text: "dispatch(myMutation)", explanationIfWrong: "React Query does not use Redux dispatch; it uses .mutate()." },
            { id: "D", text: "myMutation.send()", explanationIfWrong: "The standard method is .mutate()." }
          ],
          correctAnswer: "A",
          explanationNote: "Calling myMutation.mutate(variables) initiates the asynchronous mutation function, passing the payload arguments to mutationFn."
        }
      },
      {
        heading: "Optimistic Updates vs Invalidation",
        text: "While query invalidation refetches data from the server, optimistic updates update the local cache immediately before the server responds, improving perceived speed.",
        codeSnippet: `// Invalidation approach (simple & robust):\nonSuccess: () => {\n  queryClient.invalidateQueries({ queryKey: ['notes'] });\n}\n\n// Direct cache update:\nonSuccess: (newNote) => {\n  const notes = queryClient.getQueryData(['notes']);\n  queryClient.setQueryData(['notes'], notes.concat(newNote));\n}`,
        mcq: {
          id: "q-6.5-3-v1",
          question: "What is the benefit of updating the cache directly with queryClient.setQueryData instead of invalidating?",
          options: [
            { id: "A", text: "It avoids an extra network GET request because the mutation response already contains the updated document", explanationIfWrong: "Using the mutation response data directly saves an unnecessary round-trip request." },
            { id: "B", text: "It encrypts the entire query client with a secret key", explanationIfWrong: "setQueryData updates in-memory cache data, not encryption." },
            { id: "C", text: "It prevents errors from ever occurring", explanationIfWrong: "Errors can still happen, but network round-trips are reduced." },
            { id: "D", text: "It allows offline storage for 50 years", explanationIfWrong: "setQueryData operates in browser memory." }
          ],
          correctAnswer: "A",
          explanationNote: "When the server's POST/PUT response already returns the saved document, queryClient.setQueryData updates the cache instantly without needing a supplementary GET request."
        },
        retestMcq: {
          id: "q-6.5-3-v2",
          question: "When is queryClient.invalidateQueries preferable over manually updating cache with setQueryData?",
          options: [
            { id: "A", text: "When mutation logic is complex, affects multiple related queries, or when absolute server synchronization is more important than saving one GET request", explanationIfWrong: "Invalidation is simpler, less error-prone, and guarantees exact server alignment." },
            { id: "B", text: "When the internet connection is completely disabled", explanationIfWrong: "Invalidation requires a network connection to refetch." },
            { id: "C", text: "When writing CSS stylesheets", explanationIfWrong: "Invalidation manages data queries, not styles." },
            { id: "D", text: "Only on mobile browsers", explanationIfWrong: "Invalidation works across all platforms." }
          ],
          correctAnswer: "A",
          explanationNote: "Invalidation is simpler and more resilient: the server remains the authoritative source of truth, avoiding complex manual client-side cache manipulation."
        }
      },
      {
        heading: "Handling Mutation Errors",
        text: "The onError callback in useMutation catches backend failures, allowing you to display error notifications or revert optimistic updates.",
        codeSnippet: `const newNoteMutation = useMutation({\n  mutationFn: createNote,\n  onSuccess: () => {\n    queryClient.invalidateQueries({ queryKey: ['notes'] });\n  },\n  onError: (error) => {\n    notify(error.response.data.error || 'Failed to create note', 'error');\n  }\n});`,
        mcq: {
          id: "q-6.5-4-v1",
          question: "What parameter is passed to the onError callback when a mutation fails?",
          options: [
            { id: "A", text: "The error object thrown or rejected by the mutationFn (e.g. the Axios error containing response data)", explanationIfWrong: "onError receives the caught exception object." },
            { id: "B", text: "The user's password string", explanationIfWrong: "Passwords are never passed to error handlers." },
            { id: "C", text: "A boolean true value only", explanationIfWrong: "The complete error object is provided." },
            { id: "D", text: "undefined", explanationIfWrong: "The error object is passed to allow inspecting error.response." }
          ],
          correctAnswer: "A",
          explanationNote: "onError receives the error object rejected by mutationFn, allowing inspection of error.response.status and error.response.data to present descriptive error messages."
        },
        retestMcq: {
          id: "q-6.5-4-v2",
          question: "Can multiple components share the same queryKey and receive the same cached data without duplicate network requests?",
          options: [
            { id: "A", text: "Yes, React Query automatically deduplicates simultaneous requests and shares cached data across all components using that queryKey", explanationIfWrong: "Request deduplication and cache sharing are core features of React Query." },
            { id: "B", text: "No, each component sends its own separate network request regardless of queryKey", explanationIfWrong: "React Query deduplicates duplicate requests automatically." },
            { id: "C", text: "Only if the components are written inside the same file", explanationIfWrong: "Cache sharing works across any component wrapped in QueryClientProvider." },
            { id: "D", text: "No, queryKey must be unique to each individual component instance", explanationIfWrong: "Keys identify resources, not component instances." }
          ],
          correctAnswer: "A",
          explanationNote: "React Query shares cache by queryKey across all components in the tree, deduplicating duplicate network requests and ensuring all components display synchronized data."
        }
      },
      {
        heading: "When to Choose React Query vs Redux",
        text: "Many modern React apps use React Query for server state (caching, data fetching) combined with lightweight Context or useState for UI state, completely avoiding Redux.",
        codeSnippet: `// Modern Stack Alternative:\n// Server State: React Query (handles caching, fetching, loading booleans)\n// Client UI State: React Context + useReducer (handles notifications, modals, themes)`,
        mcq: {
          id: "q-6.5-5-v1",
          question: "Why do many teams find React Query easier than Redux for server-driven applications?",
          options: [
            { id: "A", text: "React Query handles fetching, caching, loading/error states, and refetching automatically, eliminating hundreds of lines of reducers, actions, and thunk boilerplate", explanationIfWrong: "React Query manages server state out of the box with zero custom reducers." },
            { id: "B", text: "Because React Query does not require JavaScript", explanationIfWrong: "React Query is a JavaScript/TypeScript library." },
            { id: "C", text: "Because Redux cannot be installed in modern applications", explanationIfWrong: "Redux is still widely used, especially for complex client state." },
            { id: "D", text: "Because React Query only works on SQL databases", explanationIfWrong: "React Query works with any HTTP/REST/GraphQL API." }
          ],
          correctAnswer: "A",
          explanationNote: "Because most state in web apps is simply cached server data, React Query solves data fetching, caching, and synchronization natively without needing reducers or action creators."
        },
        retestMcq: {
          id: "q-6.5-5-v2",
          question: "When is Redux Toolkit still preferable over React Query alone?",
          options: [
            { id: "A", text: "When an application has extensive, complex client-side state (canvas editors, offline-first workflows, multi-step wizards) independent of a backend API", explanationIfWrong: "Redux excels at complex purely client-side state manipulation." },
            { id: "B", text: "When the application has no state whatsoever", explanationIfWrong: "If there is no state, neither library is needed." },
            { id: "C", text: "When building static HTML pages with no JavaScript", explanationIfWrong: "Static pages require no state management library." },
            { id: "D", text: "When deploying to Linux servers", explanationIfWrong: "State libraries run in the browser, independent of server operating system." }
          ],
          correctAnswer: "A",
          explanationNote: "Redux Toolkit remains the top choice for complex, highly interactive client-side state (e.g. graphic editors, audio workstations, multi-step workflows) that isn't simple server caching."
        }
      }
    ]
  },
  {
    id: "6-6-context-api-usereducer",
    number: "6.6",
    title: "Context API & useReducer State Management",
    subtitle: "Combine React's built-in useReducer hook with Context API to build lightweight, zero-dependency global state architectures.",
    readTime: "12 min",
    objectives: [
      "Understand React's built-in useReducer hook for managing complex local component state",
      "Combine useReducer with React Context to create global state without external libraries",
      "Create custom context providers and consumer hooks (e.g. useNotificationValue, useNotificationDispatch)",
      "Compare Redux Toolkit, React Query, and Context+useReducer architectural trade-offs",
      "Avoid unnecessary re-renders in Context consumers by separating value and dispatch contexts",
      "Complete Full Stack Open Part 6 certification readiness"
    ],
    theoryBlocks: [
      {
        heading: "The useReducer Hook",
        text: "The useReducer hook is built into React, providing a Redux-style (state, action) => newState state machine without any external libraries.",
        codeSnippet: `import { useReducer } from 'react';\n\nconst counterReducer = (state, action) => {\n  switch (action.type) {\n    case 'INC': return state + 1;\n    case 'DEC': return state - 1;\n    default: return state;\n  }\n};\n\nconst [counter, counterDispatch] = useReducer(counterReducer, 0);`,
        mcq: {
          id: "q-6.6-0-v1",
          question: "What does the useReducer(reducer, initialValue) hook return in React?",
          options: [
            { id: "A", text: "An array containing [currentState, dispatchFunction]", explanationIfWrong: "useReducer returns the current state value and a dispatch function." },
            { id: "B", text: "A single boolean indicating whether the component rendered", explanationIfWrong: "It returns [state, dispatch]." },
            { id: "C", text: "A new HTML canvas element", explanationIfWrong: "It is a state management hook, not a DOM element generator." },
            { id: "D", text: "A Redux store instance", explanationIfWrong: "useReducer is a native React hook that does not require Redux." }
          ],
          correctAnswer: "A",
          explanationNote: "useReducer returns a pair: the current state value, and a dispatch function to send actions to the reducer."
        },
        retestMcq: {
          id: "q-6.6-0-v2",
          question: "When is useReducer preferable over useState for local component state?",
          options: [
            { id: "A", text: "When state logic is complex, involves multiple sub-values, or when the next state depends intimately on previous state transitions", explanationIfWrong: "useReducer organizes complex multi-step state transitions cleanly." },
            { id: "B", text: "When storing simple boolean flags (e.g. true/false)", explanationIfWrong: "Simple booleans are best handled with useState." },
            { id: "C", text: "When running tests without a browser", explanationIfWrong: "Both hooks work identically in testing environments." },
            { id: "D", text: "When compiling to C++", explanationIfWrong: "React hooks run in JavaScript." }
          ],
          correctAnswer: "A",
          explanationNote: "useReducer shines when state transitions are complex, involving interdependent fields, or when grouping related action types into a predictable state machine."
        }
      },
      {
        heading: "Sharing State with React Context",
        text: "React Context allows passing data through the component tree without manually threading props through every intermediate component level.",
        codeSnippet: `import { createContext, useContext, useReducer } from 'react';\n\nconst NotificationContext = createContext();\n\nexport const NotificationContextProvider = (props) => {\n  const [notification, notificationDispatch] = useReducer(notificationReducer, null);\n  return (\n    <NotificationContext.Provider value={[notification, notificationDispatch]}>\n      {props.children}\n    </NotificationContext.Provider>\n  );\n};`,
        mcq: {
          id: "q-6.6-1-v1",
          question: "What problem does React Context solve in large React component trees?",
          options: [
            { id: "A", text: "Prop drilling: passing props through multiple layers of intermediate components that do not need the data themselves", explanationIfWrong: "Context allows deep child components to access global data directly." },
            { id: "B", text: "Slow network connections to MongoDB Atlas", explanationIfWrong: "Context is a React frontend state mechanism, unrelated to network speeds." },
            { id: "C", text: "Syntax errors in package.json", explanationIfWrong: "Context does not validate npm metadata." },
            { id: "D", text: "Inability to use CSS in React", explanationIfWrong: "Context manages component data distribution." }
          ],
          correctAnswer: "A",
          explanationNote: "Context eliminates 'prop drilling', allowing deeply nested components to access data directly without passing props through intermediate components."
        },
        retestMcq: {
          id: "q-6.6-1-v2",
          question: "How does a child component consume the value provided by NotificationContext?",
          options: [
            { id: "A", text: "const [notification, dispatch] = useContext(NotificationContext);", explanationIfWrong: "useContext(Context) retrieves the current value from the nearest matching Provider." },
            { id: "B", text: "const value = window.NotificationContext;", explanationIfWrong: "Context is accessed through the useContext hook, not window." },
            { id: "C", text: "const value = document.getContext('Notification');", explanationIfWrong: "document.getContext is not a valid React API." },
            { id: "D", text: "const value = props.readContext();", explanationIfWrong: "useContext is a React hook called at the top level of function components." }
          ],
          correctAnswer: "A",
          explanationNote: "useContext(NotificationContext) reads the value currently exposed by the nearest <NotificationContext.Provider> higher up in the component tree."
        }
      },
      {
        heading: "Custom Context Consumer Hooks",
        text: "Exporting tailored hooks like useNotificationValue and useNotificationDispatch improves ergonomics and hides the underlying context implementation.",
        codeSnippet: `export const useNotificationValue = () => {\n  const valueAndDispatch = useContext(NotificationContext);\n  return valueAndDispatch[0];\n};\n\nexport const useNotificationDispatch = () => {\n  const valueAndDispatch = useContext(NotificationContext);\n  return valueAndDispatch[1];\n};`,
        mcq: {
          id: "q-6.6-2-v1",
          question: "Why is exporting custom hooks like useNotificationValue() better than having components call useContext(NotificationContext) directly?",
          options: [
            { id: "A", text: "It encapsulates the context details, provides clean semantic function names, and avoids importing the raw context object across every component", explanationIfWrong: "Custom hooks provide cleaner, more readable APIs for consumers." },
            { id: "B", text: "Because React throws an error if components call useContext directly", explanationIfWrong: "Direct useContext calls are valid, but custom hooks are cleaner and more maintainable." },
            { id: "C", text: "To prevent the user from typing in inputs", explanationIfWrong: "Custom hooks are purely code organization helpers." },
            { id: "D", text: "To force the browser to cache images", explanationIfWrong: "Custom hooks manage React state access." }
          ],
          correctAnswer: "A",
          explanationNote: "Custom consumer hooks (useNotificationValue) encapsulate the context implementation, providing a clean, descriptive interface and preventing consumers from needing raw context objects."
        },
        retestMcq: {
          id: "q-6.6-2-v2",
          question: "In a component that only needs to display the notification, what is the cleanest way to access it using the helper above?",
          options: [
            { id: "A", text: "const notification = useNotificationValue();", explanationIfWrong: "It extracts only the value, keeping the component code clean and minimal." },
            { id: "B", text: "const [val, setVal, dispatch, store] = useNotificationValue();", explanationIfWrong: "useNotificationValue directly returns the notification value itself." },
            { id: "C", text: "const notification = localStorage.getItem('notification');", explanationIfWrong: "useNotificationValue accesses reactive React Context state." },
            { id: "D", text: "const notification = fetch('/notification');", explanationIfWrong: "Notification state is in client React memory, not a server endpoint." }
          ],
          correctAnswer: "A",
          explanationNote: "Calling const notification = useNotificationValue() directly returns the active notification string, keeping the component concise and declarative."
        }
      },
      {
        heading: "Separating Value and Dispatch Contexts",
        text: "Splitting state value and dispatch into two separate Contexts prevents components that only dispatch from re-rendering when the state value changes.",
        codeSnippet: `// Two separate contexts:\nconst CounterContext = createContext();\nconst CounterDispatchContext = createContext();\n\n// Provider:\n<CounterContext.Provider value={counter}>\n  <CounterDispatchContext.Provider value={dispatch}>\n    {children}\n  </CounterDispatchContext.Provider>\n</CounterContext.Provider>`,
        mcq: {
          id: "q-6.6-3-v1",
          question: "Why is separating value and dispatch into two separate Contexts an important performance optimization in React Context?",
          options: [
            { id: "A", text: "Components that only need 'dispatch' will NOT re-render when the state value changes, avoiding unnecessary re-renders across action-triggering buttons", explanationIfWrong: "In React Context, any update to value causes all consumers of that context to re-render." },
            { id: "B", text: "Because React only allows 1 value per context", explanationIfWrong: "A context can hold objects/arrays, but consumers re-render on any property change." },
            { id: "C", text: "To compress the React bundle size", explanationIfWrong: "It is a runtime re-render optimization, not bundle compression." },
            { id: "D", text: "To enable TypeScript support", explanationIfWrong: "TypeScript works with single or multiple contexts." }
          ],
          correctAnswer: "A",
          explanationNote: "Because React re-renders all consumers whenever a context's value updates, separating dispatch (which is stable) from state (which changes frequently) prevents unnecessary re-renders."
        },
        retestMcq: {
          id: "q-6.6-3-v2",
          question: "If a button component only calls dispatch({ type: 'INCREMENT' }) and does not read the counter value, which context should it consume?",
          options: [
            { id: "A", text: "CounterDispatchContext", explanationIfWrong: "Consuming CounterDispatchContext ensures the button never re-renders when the counter increments." },
            { id: "B", text: "CounterContext", explanationIfWrong: "Consuming CounterContext would cause the button to re-render on every increment." },
            { id: "C", text: "window.localStorage", explanationIfWrong: "Context is used for in-memory React state." },
            { id: "D", text: "Both contexts simultaneously", explanationIfWrong: "Consuming only the dispatch context provides the performance benefit." }
          ],
          correctAnswer: "A",
          explanationNote: "By consuming only CounterDispatchContext, the button receives the stable dispatch function and never re-renders when the counter count changes."
        }
      },
      {
        heading: "Comparing State Management Strategies",
        text: "Full Stack Open teaches three primary state architectures: Redux Toolkit (centralized store), TanStack Query (server state), and Context+useReducer (lightweight zero-dependency).",
        codeSnippet: `// 1. Redux Toolkit: Industry standard for complex client-side applications\n// 2. TanStack Query: Best for server-driven data caching and synchronization\n// 3. Context + useReducer: Built-in, zero-dependency solution for simple shared state`,
        mcq: {
          id: "q-6.6-4-v1",
          question: "When is React's built-in Context + useReducer architecture preferable over installing Redux Toolkit?",
          options: [
            { id: "A", text: "For small-to-medium applications with simple shared state (e.g. notifications, user themes) where adding extra dependencies like Redux would be overkill", explanationIfWrong: "Context + useReducer is built into React with zero extra dependencies." },
            { id: "B", text: "When building applications with more than 10 million users", explanationIfWrong: "User count does not dictate client-side state library choice." },
            { id: "C", text: "When the application does not use JavaScript", explanationIfWrong: "All React applications use JavaScript." },
            { id: "D", text: "When the developer does not know how to write functions", explanationIfWrong: "Both approaches require writing standard JavaScript functions." }
          ],
          correctAnswer: "A",
          explanationNote: "React's native Context API and useReducer hook provide a clean, zero-dependency alternative to Redux for applications with moderate state requirements."
        },
        retestMcq: {
          id: "q-6.6-4-v2",
          question: "What is a known limitation of using React Context for frequently updating, fine-grained state compared to Redux Toolkit?",
          options: [
            { id: "A", text: "Context lacks built-in fine-grained selector subscriptions (like useSelector), causing all consumers of a context to re-render when any part of that context value changes", explanationIfWrong: "React Context triggers re-renders on all consumers without selector bail-out." },
            { id: "B", text: "Context can only store strings, not objects", explanationIfWrong: "Context can hold any JavaScript object or data structure." },
            { id: "C", text: "Context is deleted every 2 seconds by the browser", explanationIfWrong: "Context persists as long as the Provider remains mounted." },
            { id: "D", text: "Context cannot be used in function components", explanationIfWrong: "useContext is a core function component hook." }
          ],
          correctAnswer: "A",
          explanationNote: "React Context lacks selector-based subscription optimization. When context updates, every consuming component re-renders unless carefully split into multiple contexts."
        }
      },
      {
        heading: "Full Stack Open Part 6 Certification",
        text: "Part 6 empowers you with comprehensive state management mastery: pure reducers, React-Redux hooks, modern Redux Toolkit, Redux Thunk, TanStack Query, and Context API.",
        codeSnippet: `// Complete State Management Toolkit:\n// - Flux & Redux Core: Pure functions & unidirectional flow\n// - React-Redux: useSelector & useDispatch\n// - RTK: createSlice & configureStore (with Immer)\n// - Redux Thunk: Async actions & API synchronization\n// - TanStack Query: Declarative server state caching\n// - Context + useReducer: Zero-dependency React state`,
        mcq: {
          id: "q-6.6-5-v1",
          question: "Which of the following summaries best captures the complete state management engineering skills mastered in Part 6?",
          options: [
            { id: "A", text: "Unidirectional data flow, pure reducers with Immer, Redux Toolkit slices, async thunks, TanStack Query server caching, and native React Context + useReducer", explanationIfWrong: "This comprehensive summary encompasses the entire depth of Part 6." },
            { id: "B", text: "Writing raw HTML tables with inline onclick scripts and no state management", explanationIfWrong: "Part 6 focuses on advanced state management in modern React." },
            { id: "C", text: "Configuring Linux Apache web servers without frontend JavaScript", explanationIfWrong: "Part 6 is dedicated to frontend React state architectures." },
            { id: "D", text: "Writing SQL stored procedures for PostgreSQL", explanationIfWrong: "Part 6 focuses on frontend state libraries." }
          ],
          correctAnswer: "A",
          explanationNote: "Part 6 provides deep mastery over all major modern state paradigms: classic Redux principles, Redux Toolkit, asynchronous thunks, TanStack Query server state, and React Context."
        },
        retestMcq: {
          id: "q-6.6-5-v2",
          question: "What is the overarching architectural goal of mastering multiple state management strategies?",
          options: [
            { id: "A", text: "To choose the right tool for the job: using React Query for server data, local state for form inputs, and Redux or Context for complex shared client state", explanationIfWrong: "Experienced developers choose the most effective, maintainable tool for each state category." },
            { id: "B", text: "To install all three libraries simultaneously on every single component", explanationIfWrong: "Libraries should be chosen deliberately based on application needs, not crammed together." },
            { id: "C", text: "To eliminate the need for writing unit tests", explanationIfWrong: "Testing remains essential regardless of state architecture." },
            { id: "D", text: "To prevent the browser from rendering the UI", explanationIfWrong: "State management powers responsive, reliable user interfaces." }
          ],
          correctAnswer: "A",
          explanationNote: "Modern frontend mastery means selecting the right tool for each job: TanStack Query for server state, useState for local inputs, and Redux Toolkit or Context for global app coordination."
        }
      }
    ]
  }
];

// Helper functions for Level attempts, question selection, and 3-consecutive-failure progression lock
export const getLevelAttemptCountFullstackPart6 = (sectionId: string, studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_fullstack_p6_attempt_${sectionId}_${studentId}`);
    return saved ? Number(saved) : 1;
  } catch {
    return 1;
  }
};

export const setLevelAttemptCountFullstackPart6 = (sectionId: string, studentId: string, count: number): void => {
  try {
    localStorage.setItem(`dopilot_fullstack_p6_attempt_${sectionId}_${studentId}`, String(count));
  } catch {}
};

export const getActiveQuestionsForLevelFullstackPart6 = (
  section: SectionContent,
  studentId: string,
  forceRetest: boolean = false
): McqQuestion[] => {
  const attempt = forceRetest ? 2 : getLevelAttemptCountFullstackPart6(section.id, studentId);
  return section.theoryBlocks.map((block) => {
    if (attempt >= 2 && block.retestMcq) {
      return block.retestMcq;
    }
    return block.mcq!;
  });
};

export const getConsecutiveFailedLevelsFullstackPart6 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_fullstack_p6_failed_levels_streak_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const recordLevelAttemptResultFullstackPart6 = (
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
  const currentAttempt = getLevelAttemptCountFullstackPart6(sectionId, studentId);

  if (isPassed) {
    try {
      localStorage.setItem(`dopilot_fullstack_p6_failed_levels_streak_${studentId}`, '0');
      localStorage.setItem(`dopilot_fullstack_p6_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_fullstack_p6_attempt_${sectionId}_${studentId}`, '1');
      localStorage.removeItem(`dopilot_fullstack_p6_locked_${studentId}`);
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
      setLevelAttemptCountFullstackPart6(sectionId, studentId, 2);
      const streak = getConsecutiveFailedLevelsFullstackPart6(studentId);

      return {
        isPassed: false,
        attemptCount: 1,
        isSecondFailureInLevel: false,
        consecutiveFailedLevels: streak,
        isLocked: false
      };
    } else {
      const prevStreak = getConsecutiveFailedLevelsFullstackPart6(studentId);
      const newStreak = prevStreak + 1;
      const isLocked = newStreak >= 3;

      try {
        localStorage.setItem(`dopilot_fullstack_p6_failed_levels_streak_${studentId}`, String(newStreak));
        localStorage.setItem(`dopilot_fullstack_p6_consecutive_failures_${studentId}`, String(newStreak));
        if (isLocked) {
          localStorage.setItem(`dopilot_fullstack_p6_locked_${studentId}`, 'true');
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

export const resetConsecutiveFailuresFullstackPart6 = (studentId: string): void => {
  try {
    localStorage.setItem(`dopilot_fullstack_p6_consecutive_failures_${studentId}`, '0');
    localStorage.setItem(`dopilot_fullstack_p6_failed_levels_streak_${studentId}`, '0');
    localStorage.removeItem(`dopilot_fullstack_p6_locked_${studentId}`);
  } catch {}
};
