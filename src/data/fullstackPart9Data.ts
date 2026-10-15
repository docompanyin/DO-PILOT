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

export const FULLSTACK_PART_9_SECTIONS: SectionContent[] = [
  {
    id: "9-1-typescript-basics",
    number: "9.1",
    title: "Background and Introduction to TypeScript",
    subtitle: "Understand static type checking, configure the tsc compiler with tsconfig.json, and execute TypeScript with ts-node.",
    readTime: "12 min",
    objectives: [
      "Understand the motivation for static typing over dynamic JavaScript",
      "Configure compilation options in tsconfig.json (target, module, strict)",
      "Work with primitive types: number, string, boolean, null, and undefined",
      "Leverage TypeScript's automatic type inference",
      "Run TypeScript files in development using ts-node and ts-node-dev",
      "Explain the distinction between compile-time type checking and runtime execution"
    ],
    theoryBlocks: [
      {
        heading: "What is TypeScript?",
        text: "TypeScript is a typed superset of JavaScript that compiles down to plain JavaScript, catching type mismatches at compile time before execution.",
        codeSnippet: `// TypeScript code with type annotations\nconst multiply = (a: number, b: number): number => a * b;\n// tsc compiles this to standard JavaScript for the browser or Node.js`,
        mcq: {
          id: "q-9.1-0-v1",
          question: "When does TypeScript perform type checking on your code?",
          options: [
            { id: "A", text: "At compile time (build/transpilation time) before the code runs" },
            { id: "B", text: "At runtime when the user loads the webpage" },
            { id: "C", text: "Inside the database server when queries execute" },
            { id: "D", text: "Only when an uncaught exception is thrown" }
          ],
          correctAnswer: "A",
          explanationNote: "TypeScript is a static type checker. Type checking happens at compile time; runtime environments (browsers/Node.js) execute pure compiled JavaScript without type annotations."
        },
        retestMcq: {
          id: "q-9.1-0-v2",
          question: "What happens to TypeScript type annotations (e.g. `: number`) during compilation by `tsc`?",
          options: [
            { id: "A", text: "They are completely erased and not present in the output JavaScript" },
            { id: "B", text: "They are converted into `if (typeof x !== ...)` runtime assertions" },
            { id: "C", text: "They are encoded into HTTP headers" },
            { id: "D", text: "They remain as native browser JavaScript keywords" }
          ],
          correctAnswer: "A",
          explanationNote: "TypeScript employs type erasure: all type declarations and annotations are removed during compilation, producing clean standard JavaScript."
        }
      },
      {
        heading: "The tsconfig.json Configuration File",
        text: "The `tsconfig.json` file specifies the root files and compiler options required to compile the TypeScript project.",
        codeSnippet: `{\n  "compilerOptions": {\n    "target": "ES2022",\n    "module": "commonjs",\n    "strict": true,\n    "noImplicitAny": true\n  }\n}`,
        mcq: {
          id: "q-9.1-1-v1",
          question: "What does enabling `\"strict\": true` in `tsconfig.json` do?",
          options: [
            { id: "A", text: "It activates a broad suite of strict type-checking behaviors, including `noImplicitAny` and `strictNullChecks`" },
            { id: "B", text: "It prevents using any external npm dependencies" },
            { id: "C", text: "It restricts variables to uppercase names only" },
            { id: "D", text: "It automatically formats code with Prettier" }
          ],
          correctAnswer: "A",
          explanationNote: "`\"strict\": true` enables all strict type checking flags, ensuring maximum type safety and catching subtle null/undefined bugs."
        },
        retestMcq: {
          id: "q-9.1-1-v2",
          question: "What does the `\"noImplicitAny\": true` option enforce in TypeScript?",
          options: [
            { id: "A", text: "It raises a compiler error on expressions and declarations with an implied `any` type" },
            { id: "B", text: "It forbids any function from accepting more than one argument" },
            { id: "C", text: "It forces all functions to return promises" },
            { id: "D", text: "It converts null values to empty strings automatically" }
          ],
          correctAnswer: "A",
          explanationNote: "When `noImplicitAny` is enabled, any variable or parameter that TypeScript cannot infer without falling back to `any` produces a compiler error."
        }
      },
      {
        heading: "Basic Primitive Types",
        text: "TypeScript provides the core JavaScript primitive types: `number`, `string`, `boolean`, `null`, `undefined`, and `symbol`.",
        codeSnippet: `let age: number = 25;\nlet name: string = "Arto";\nlet isStudent: boolean = true;\nlet nothing: null = null;`,
        mcq: {
          id: "q-9.1-2-v1",
          question: "Which of the following represents the correct lowercase primitive types in TypeScript?",
          options: [
            { id: "A", text: "`number`, `string`, and `boolean`" },
            { id: "B", text: "`Number`, `String`, and `Boolean` (object wrappers)" },
            { id: "C", text: "`int`, `varchar`, and `bool`" },
            { id: "D", text: "`float`, `text`, and `bit`" }
          ],
          correctAnswer: "A",
          explanationNote: "Always use lowercase primitive types (`number`, `string`, `boolean`). Capitalized names (`Number`, `String`) refer to JavaScript boxed wrapper objects."
        },
        retestMcq: {
          id: "q-9.1-2-v2",
          question: "Unlike Java or C++, how does TypeScript's `number` type represent integers and floating-point values?",
          options: [
            { id: "A", text: "Both integers and floating-point values share the single `number` type" },
            { id: "B", text: "Integers must be declared as `int` and floats as `double`" },
            { id: "C", text: "Integers must be wrapped in `BigInt` exclusively" },
            { id: "D", text: "Floating point numbers are not supported in TypeScript" }
          ],
          correctAnswer: "A",
          explanationNote: "Like JavaScript, TypeScript numbers are double-precision 64-bit IEEE 754 floating point values; there is no separate `int` or `float` primitive."
        }
      },
      {
        heading: "Automatic Type Inference",
        text: "TypeScript automatically infers the type of a variable based on its initial assignment, making explicit type annotations optional in simple cases.",
        codeSnippet: `// TypeScript infers 'message' is of type string\nlet message = "Hello, Full Stack Open";\n// Error: Type 'number' is not assignable to type 'string'\nmessage = 42;`,
        mcq: {
          id: "q-9.1-3-v1",
          question: "What is type inference in TypeScript?",
          options: [
            { id: "A", text: "The compiler's ability to automatically deduce the type of an expression when no explicit annotation is given" },
            { id: "B", text: "Converting string values to numbers at runtime" },
            { id: "C", text: "A tool that downloads TypeScript types from npm automatically" },
            { id: "D", text: "A linter rule that removes unused imports" }
          ],
          correctAnswer: "A",
          explanationNote: "Type inference allows developers to write concise code: TypeScript deduces the type from the initial value without needing redundant manual annotations."
        },
        retestMcq: {
          id: "q-9.1-3-v2",
          question: "If you declare `let count;` without an initial value or type annotation, what type does TypeScript assign to it by default?",
          options: [
            { id: "A", text: "`any`" },
            { id: "B", text: "`never`" },
            { id: "C", text: "`void`" },
            { id: "D", text: "`unknown`" }
          ],
          correctAnswer: "A",
          explanationNote: "Declaring a variable with neither initial value nor type annotation defaults to `any`, which disables static type checks on that variable."
        }
      },
      {
        heading: "The any Type and Its Hazards",
        text: "The `any` type disables all compile-time type checking for a variable; overusing `any` undermines TypeScript's safety guarantees.",
        codeSnippet: `let data: any = "hello";\ndata = 42; // Allowed\ndata.nonExistentMethod(); // Compiles fine, but crashes at runtime!`,
        mcq: {
          id: "q-9.1-4-v1",
          question: "Why is the `any` type considered dangerous in TypeScript codebases?",
          options: [
            { id: "A", text: "It turns off type checking for that value, forfeiting the compile-time safety benefits of TypeScript" },
            { id: "B", text: "It doubles the bundle size of the compiled JavaScript" },
            { id: "C", text: "It slows down CPU calculation speeds by 10x" },
            { id: "D", text: "It is deprecated and will be removed in TypeScript 6" }
          ],
          correctAnswer: "A",
          explanationNote: "`any` acts as an escape hatch that disables compiler checks. Accessing nonexistent properties on `any` compiles without warnings but crashes at runtime."
        },
        retestMcq: {
          id: "q-9.1-4-v2",
          question: "Which safer alternative to `any` should be used for values of unknown shape that must be narrowed before use?",
          options: [
            { id: "A", text: "`unknown`" },
            { id: "B", text: "`never`" },
            { id: "C", text: "`void`" },
            { id: "D", text: "`object`" }
          ],
          correctAnswer: "A",
          explanationNote: "`unknown` represents any value, but TypeScript forces you to perform type checks or narrowing before accessing properties on it."
        }
      },
      {
        heading: "Running TypeScript with ts-node",
        text: "`ts-node` executes TypeScript files directly in Node.js by compiling them in-memory, eliminating the manual build step during development.",
        codeSnippet: `// Run script directly in dev without manual tsc build:\n// npx ts-node calculator.ts 10 5 multiply\nimport { calculator } from './calculator';\nconsole.log(calculator(10, 5, 'multiply'));`,
        mcq: {
          id: "q-9.1-5-v1",
          question: "What is the primary convenience of using `ts-node` or `ts-node-dev` during development?",
          options: [
            { id: "A", text: "It compiles TypeScript in-memory on the fly, allowing direct execution without manual `tsc` build steps" },
            { id: "B", text: "It deploys code to production servers automatically" },
            { id: "C", text: "It replaces the PostgreSQL database with an in-memory database" },
            { id: "D", text: "It converts React components into native mobile code" }
          ],
          correctAnswer: "A",
          explanationNote: "`ts-node` enables rapid development iteration by transpiling and running `.ts` files on the fly without writing `.js` output to disk."
        },
        retestMcq: {
          id: "q-9.1-5-v2",
          question: "Why should `tsc` still be run for production builds instead of using `ts-node` in production?",
          options: [
            { id: "A", text: "`tsc` pre-compiles to pure JavaScript files for fast startup and low memory usage in production" },
            { id: "B", text: "`ts-node` is banned by all cloud hosting providers" },
            { id: "C", text: "`tsc` compresses images while `ts-node` does not" },
            { id: "D", text: "`ts-node` cannot read environment variables" }
          ],
          correctAnswer: "A",
          explanationNote: "In production, compiling ahead-of-time with `tsc` produces optimized JavaScript files that standard `node dist/index.js` executes with zero compilation overhead."
        }
      }
    ]
  },
  {
    id: "9-2-first-steps-typescript",
    number: "9.2",
    title: "First Steps with TypeScript: CLI & Functions",
    subtitle: "Type function signatures, work with arrays and typed tuples, process command-line arguments, and handle type errors.",
    readTime: "12 min",
    objectives: [
      "Annotate function parameter types and return types explicitly",
      "Declare array types and immutable readonly arrays",
      "Process and validate command-line arguments from process.argv",
      "Use literal types and union types to restrict acceptable values",
      "Implement defensive type guards and error handling in TypeScript functions",
      "Configure npm scripts to run type checking and development servers"
    ],
    theoryBlocks: [
      {
        heading: "Function Parameter & Return Types",
        text: "Functions should explicitly type their parameters; return types can be inferred or explicitly declared after the parameter list.",
        codeSnippet: `const calculateBmi = (heightCm: number, weightKg: number): string => {\n  const heightMeters = heightCm / 100;\n  const bmi = weightKg / (heightMeters * heightMeters);\n  return bmi < 18.5 ? "Underweight" : "Normal weight";\n};`,
        mcq: {
          id: "q-9.2-0-v1",
          question: "Where is the return type of a TypeScript function specified?",
          options: [
            { id: "A", text: "After the parameter list and colon: `(a: number, b: number): number => ...`" },
            { id: "B", text: "Before the `const` keyword" },
            { id: "C", text: "Inside the function body using the `type` statement" },
            { id: "D", text: "In the `package.json` file" }
          ],
          correctAnswer: "A",
          explanationNote: "Function return types are declared after the closing parenthesis of the parameter list, preceded by a colon."
        },
        retestMcq: {
          id: "q-9.2-0-v2",
          question: "What return type should you declare for a function that does not return any value?",
          options: [
            { id: "A", text: "`void`" },
            { id: "B", text: "`null`" },
            { id: "C", text: "`undefined`" },
            { id: "D", text: "`never`" }
          ],
          correctAnswer: "A",
          explanationNote: "`void` represents the return value of functions that do not return a value (or return undefined without an explicit expression)."
        }
      },
      {
        heading: "Array Types & Typed Arrays",
        text: "Arrays can be typed using square brackets (`number[]`) or the generic syntax (`Array<number>`).",
        codeSnippet: `const dailyExerciseHours: number[] = [2, 1, 0, 3, 2, 2.5];\nconst names: Array<string> = ["Alice", "Bob", "Charlie"];`,
        mcq: {
          id: "q-9.2-1-v1",
          question: "What is the idiomatic syntax for typing an array of numbers in TypeScript?",
          options: [
            { id: "A", text: "`number[]` or `Array<number>`" },
            { id: "B", text: "`[number]`" },
            { id: "C", text: "`numbers`" },
            { id: "D", text: "`List[number]`" }
          ],
          correctAnswer: "A",
          explanationNote: "Both `number[]` and `Array<number>` denote an array containing number elements. `[number]` on the other hand represents a tuple of length 1."
        },
        retestMcq: {
          id: "q-9.2-1-v2",
          question: "What does the tuple type `[string, number]` define?",
          options: [
            { id: "A", text: "An array of fixed length 2, where index 0 is a string and index 1 is a number" },
            { id: "B", text: "An array containing an infinite list of strings and numbers in any order" },
            { id: "C", text: "A key-value map object" },
            { id: "D", text: "A string that can be coerced into a number" }
          ],
          correctAnswer: "A",
          explanationNote: "A tuple is an array with fixed length and specific types at each known index position."
        }
      },
      {
        heading: "Union Types and Literal Types",
        text: "Union types (`A | B`) allow a value to be one of several types, while literal types restrict values to exact specific strings or numbers.",
        codeSnippet: `type Operation = 'multiply' | 'add' | 'divide';\nconst calculator = (a: number, b: number, op: Operation): number => {\n  if (op === 'multiply') return a * b;\n  if (op === 'add') return a + b;\n  return a / b;\n};`,
        mcq: {
          id: "q-9.2-2-v1",
          question: "What is a union type in TypeScript?",
          options: [
            { id: "A", text: "A type formed from two or more other types, representing values that may be any one of them (`string | number`)" },
            { id: "B", text: "A union between two different database tables" },
            { id: "C", text: "A function that merges two arrays into one" },
            { id: "D", text: "A build tool plugin" }
          ],
          correctAnswer: "A",
          explanationNote: "Union types (formed with `|`) model values that can be one of multiple distinct types or literal values."
        },
        retestMcq: {
          id: "q-9.2-2-v2",
          question: "Given `type Direction = 'north' | 'south' | 'east' | 'west'`, what happens if you call `move('up')`?",
          options: [
            { id: "A", text: "TypeScript throws a compile-time error because 'up' is not assignable to type Direction" },
            { id: "B", text: "The code compiles and silently assigns 'north'" },
            { id: "C", text: "The browser reloads the page" },
            { id: "D", text: "It converts 'up' to a number" }
          ],
          correctAnswer: "A",
          explanationNote: "String literal union types only allow the exact string literals specified; any other string produces a compile-time type error."
        }
      },
      {
        heading: "Handling CLI Arguments (process.argv)",
        text: "Node's `process.argv` returns an array of strings, so inputs parsed from the command line must be converted and validated before use.",
        codeSnippet: `const a = Number(process.argv[2]);\nconst b = Number(process.argv[3]);\nif (isNaN(a) || isNaN(b)) {\n  throw new Error('Provided values were not numbers!');\n}`,
        mcq: {
          id: "q-9.2-3-v1",
          question: "What data type does `process.argv` contain in Node.js and TypeScript?",
          options: [
            { id: "A", text: "`string[]` (an array of strings)" },
            { id: "B", text: "`number[]`" },
            { id: "C", text: "`any[]`" },
            { id: "D", text: "`Buffer[]`" }
          ],
          correctAnswer: "A",
          explanationNote: "`process.argv` is an array of strings. Command-line parameters like numbers must be explicitly parsed (e.g. via `Number()`)."
        },
        retestMcq: {
          id: "q-9.2-3-v2",
          question: "Why do indices for custom CLI arguments in `process.argv` begin at index 2?",
          options: [
            { id: "A", text: "Index 0 is the Node executable path and index 1 is the script file path" },
            { id: "B", text: "Because JavaScript arrays start at index 2 in Node.js" },
            { id: "C", text: "Index 0 and 1 are reserved for system environment variables" },
            { id: "D", text: "It is an arbitrary bug in V8 engine" }
          ],
          correctAnswer: "A",
          explanationNote: "`process.argv[0]` is the path to the `node` binary and `process.argv[1]` is the path to the executing script; custom arguments start at index 2."
        }
      },
      {
        heading: "Defensive Error Handling with Error Objects",
        text: "In modern TypeScript, caught error values in `catch (error)` are typed as `unknown`, requiring type narrowing before accessing `error.message`.",
        codeSnippet: `try {\n  calculator(1, 0, 'divide');\n} catch (error: unknown) {\n  let errorMessage = 'Something went wrong: ';\n  if (error instanceof Error) {\n    errorMessage += error.message;\n  }\n  console.log(errorMessage);\n}`,
        mcq: {
          id: "q-9.2-4-v1",
          question: "Why does TypeScript with `useUnknownInCatchVariables` type `catch (error)` variables as `unknown` instead of `any`?",
          options: [
            { id: "A", text: "Because JavaScript allows throwing anything (`throw 'error'`, `throw 42`), not just `Error` instances" },
            { id: "B", text: "Because errors are deleted from memory before the catch block runs" },
            { id: "C", text: "To prevent catch blocks from using console.log" },
            { id: "D", text: "Because Node.js does not support error objects" }
          ],
          correctAnswer: "A",
          explanationNote: "In JavaScript, any expression can be thrown. Typing catch variables as `unknown` forces developers to verify `error instanceof Error` before accessing `.message`."
        },
        retestMcq: {
          id: "q-9.2-4-v2",
          question: "What check safely narrows an `unknown` error variable to access its `.message` property?",
          options: [
            { id: "A", text: "`if (error instanceof Error) { console.log(error.message); }`" },
            { id: "B", text: "`if (typeof error === 'error')`" },
            { id: "C", text: "`if (error.hasMessage)`" },
            { id: "D", text: "`error.asString()`" }
          ],
          correctAnswer: "A",
          explanationNote: "`instanceof Error` checks if the value inherits from JavaScript's built-in `Error` class, narrowing its type so `.message` is safe to access."
        }
      },
      {
        heading: "Interfaces vs Type Aliases",
        text: "Both `interface` and `type` can describe object shapes; interfaces are extendable with `extends`, while type aliases can also represent unions and primitives.",
        codeSnippet: `interface Person {\n  name: string;\n  age: number;\n}\ntype Point = { x: number; y: number };\ntype ID = string | number; // union only possible with type`,
        mcq: {
          id: "q-9.2-5-v1",
          question: "What is one capability of `type` aliases that `interface` cannot do directly?",
          options: [
            { id: "A", text: "Declare union types, primitive aliases, and tuple types directly" },
            { id: "B", text: "Type object shapes" },
            { id: "C", text: "Be exported and imported between files" },
            { id: "D", text: "Compile to JavaScript" }
          ],
          correctAnswer: "A",
          explanationNote: "While both can describe object shapes, `type` aliases can name primitives (`type ID = string`), unions (`type Status = 'open' | 'closed'`), and tuples."
        },
        retestMcq: {
          id: "q-9.2-5-v2",
          question: "How do you define an optional property in a TypeScript interface?",
          options: [
            { id: "A", text: "By adding a question mark `?` after the property name (e.g. `phone?: string;`)" },
            { id: "B", text: "By prefixing the property with `optional`" },
            { id: "C", text: "By assigning it a value of `null`" },
            { id: "D", text: "By adding `!` after the property name" }
          ],
          correctAnswer: "A",
          explanationNote: "The question mark `?` signifies an optional property; objects implementing the interface can omit that property or provide `undefined`."
        }
      }
    ]
  },
  {
    id: "9-3-typing-express-backend",
    number: "9.3",
    title: "Typing an Express Backend: REST & Data Validation",
    subtitle: "Build type-safe Express REST APIs using @types/express, typed request handlers, and modular services.",
    readTime: "12 min",
    objectives: [
      "Set up an Express project with TypeScript and type definition packages (@types/express)",
      "Structure Express applications into routes, controllers, and services with clean typing",
      "Type request parameters, query strings, and request bodies",
      "Avoid unintended type leaks when returning partial or sensitive data",
      "Use ts-node-dev for automatic server reloading during backend development",
      "Export shared domain types and enums across service layers"
    ],
    theoryBlocks: [
      {
        heading: "Installing Type Definitions (@types packages)",
        text: "Libraries written in JavaScript require separate TypeScript definition packages from the `@types` scope (e.g. `@types/express`, `@types/node`).",
        codeSnippet: `// Install Express and its type definitions as devDependencies:\n// npm install express\n// npm install --save-dev @types/express @types/node typescript ts-node-dev`,
        mcq: {
          id: "q-9.3-0-v1",
          question: "Why do packages like `express` require installing `@types/express` as a devDependency?",
          options: [
            { id: "A", text: "Express is written in plain JavaScript; `@types/express` provides type declarations from DefinitelyTyped" },
            { id: "B", text: "Because Express cannot handle HTTP requests without TypeScript" },
            { id: "C", text: "To encrypt incoming HTTP requests with SSL" },
            { id: "D", text: "It compiles Express into Python" }
          ],
          correctAnswer: "A",
          explanationNote: "Many popular npm packages are written in plain JS. The community maintains DefinitelyTyped (`@types/*`) packages to supply type definitions for them."
        },
        retestMcq: {
          id: "q-9.3-0-v2",
          question: "Where are `@types/*` packages typically stored in your `package.json` file?",
          options: [
            { id: "A", text: "Under `devDependencies` because type declarations are only used during development and compilation" },
            { id: "B", text: "Under `peerDependencies`" },
            { id: "C", text: "In `bundledDependencies`" },
            { id: "D", text: "Under `dependencies` required for production runtime" }
          ],
          correctAnswer: "A",
          explanationNote: "Type definitions are strictly build-time tools that do not execute at runtime, so they belong in `devDependencies`."
        }
      },
      {
        heading: "Typing Express Request & Response Objects",
        text: "Import `Request` and `Response` types from `express` to strongly type router handler functions.",
        codeSnippet: `import express, { Request, Response } from 'express';\nconst app = express();\napp.use(express.json());\napp.get('/ping', (_req: Request, res: Response) => {\n  res.send('pong');\n});`,
        mcq: {
          id: "q-9.3-1-v1",
          question: "Why is the first parameter named `_req` with a leading underscore in `(_req: Request, res: Response)`?",
          options: [
            { id: "A", text: "To indicate to the TypeScript compiler that the parameter is intentionally unused, avoiding `noUnusedParameters` warnings" },
            { id: "B", text: "To make the request object private" },
            { id: "C", text: "Because Express requires underscore prefixes" },
            { id: "D", text: "To convert the parameter into a global variable" }
          ],
          correctAnswer: "A",
          explanationNote: "Prefixing an unused parameter with an underscore tells TypeScript that it is deliberately unused, satisfying strict compiler rules."
        },
        retestMcq: {
          id: "q-9.3-1-v2",
          question: "How do you declare typed URL parameters, query strings, and body data on an Express `Request` type?",
          options: [
            { id: "A", text: "Using generic type arguments: `Request<Params, ResBody, ReqBody, ReqQuery>`" },
            { id: "B", text: "By casting `req` to an array" },
            { id: "C", text: "By passing a JSON schema to `express()`" },
            { id: "D", text: "Through the `tsconfig.json` compiler options" }
          ],
          correctAnswer: "A",
          explanationNote: "The `Request` interface from `@types/express` accepts generic type parameters defining the shape of params, response body, request body, and query string."
        }
      },
      {
        heading: "Separation of Concerns: Service Layer Pattern",
        text: "Moving business logic into dedicated service modules keeps router controllers slim and allows types to be reused cleanly.",
        codeSnippet: `// diaryService.ts\nimport diaries from '../../data/diaries';\nimport { DiaryEntry, NonSensitiveDiaryEntry } from '../types';\nexport const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] => {\n  return diaries.map(({ id, date, weather, visibility }) => ({ id, date, weather, visibility }));\n};`,
        mcq: {
          id: "q-9.3-2-v1",
          question: "In the Full Stack Open diary service example, why do we explicitly omit the `comment` field in `getNonSensitiveEntries`?",
          options: [
            { id: "A", text: "Because TypeScript types are erased at runtime; returning the full object would still leak the sensitive comment property" },
            { id: "B", text: "Because Express crashes if comments contain spaces" },
            { id: "C", text: "Because JSON cannot serialize string comments" },
            { id: "D", text: "Because TypeScript interfaces delete object properties automatically" }
          ],
          correctAnswer: "A",
          explanationNote: "TypeScript types do not modify runtime data! Type-casting an object does not strip fields; you must explicitly pick or omit fields at runtime."
        },
        retestMcq: {
          id: "q-9.3-2-v2",
          question: "Which TypeScript utility type constructs a type by picking all properties from `Type` and then removing `Keys`?",
          options: [
            { id: "A", text: "`Omit<Type, Keys>`" },
            { id: "B", text: "`Pick<Type, Keys>`" },
            { id: "C", text: "`Exclude<Type, Keys>`" },
            { id: "D", text: "`Partial<Type>`" }
          ],
          correctAnswer: "A",
          explanationNote: "`Omit<Type, Keys>` creates a new type by picking all properties from an existing type except those listed in `Keys` (e.g. `Omit<DiaryEntry, 'comment'>`)."
        }
      },
      {
        heading: "Utility Types: Pick and Omit",
        text: "TypeScript provides built-in utility types like `Omit<T, K>` and `Pick<T, K>` to create derivative types without duplicating code.",
        codeSnippet: `export interface DiaryEntry {\n  id: number;\n  date: string;\n  weather: Weather;\n  visibility: Visibility;\n  comment?: string;\n}\nexport type NonSensitiveDiaryEntry = Omit<DiaryEntry, 'comment'>;\nexport type NewDiaryEntry = Omit<DiaryEntry, 'id'>;`,
        mcq: {
          id: "q-9.3-3-v1",
          question: "What does `type NewDiaryEntry = Omit<DiaryEntry, 'id'>;` represent?",
          options: [
            { id: "A", text: "The shape of a new diary entry before an `id` has been generated and assigned by the database" },
            { id: "B", text: "A diary entry that can only be deleted" },
            { id: "C", text: "A diary entry with an empty string as its ID" },
            { id: "D", text: "An array of diary IDs" }
          ],
          correctAnswer: "A",
          explanationNote: "When creating a new entity, the server or database assigns the ID; `Omit<DiaryEntry, 'id'>` types the incoming creation payload without an ID."
        },
        retestMcq: {
          id: "q-9.3-3-v2",
          question: "What does the utility type `Pick<DiaryEntry, 'date' | 'weather'>` do?",
          options: [
            { id: "A", text: "It creates a new type containing ONLY the `date` and `weather` properties from DiaryEntry" },
            { id: "B", text: "It deletes the date and weather properties from the database" },
            { id: "C", text: "It extracts the first element of an array" },
            { id: "D", text: "It generates random dates and weather strings" }
          ],
          correctAnswer: "A",
          explanationNote: "`Pick<Type, Keys>` constructs a type by picking the set of properties `Keys` from `Type`."
        }
      },
      {
        heading: "TypeScript Enums in Backend Logic",
        text: "TypeScript `enum` allows defining a set of named constants; string enums provide type safety and runtime value validation.",
        codeSnippet: `export enum Weather {\n  Sunny = 'sunny',\n  Rainy = 'rainy',\n  Cloudy = 'cloudy',\n  Stormy = 'stormy',\n  Windy = 'windy',\n}`,
        mcq: {
          id: "q-9.3-4-v1",
          question: "Unlike interfaces and type aliases which are erased during compilation, what do TypeScript `enum`s produce?",
          options: [
            { id: "A", text: "Real JavaScript objects that exist at runtime and can be iterated or checked" },
            { id: "B", text: "Nothing; enums are also completely erased" },
            { id: "C", text: "SQL table creation scripts" },
            { id: "D", text: "WebAssembly modules" }
          ],
          correctAnswer: "A",
          explanationNote: "Enums are one of the few TypeScript features that are NOT type-only: they compile into real JavaScript objects accessible at runtime."
        },
        retestMcq: {
          id: "q-9.3-4-v2",
          question: "Why are string enums (e.g. `Sunny = 'sunny'`) preferred over numeric default enums in web APIs?",
          options: [
            { id: "A", text: "They serialize directly to meaningful string values in JSON payloads and debug logs" },
            { id: "B", text: "They run 10x faster in Node.js" },
            { id: "C", text: "They prevent network packets from being fragmented" },
            { id: "D", text: "They eliminate the need for Express routing" }
          ],
          correctAnswer: "A",
          explanationNote: "Numeric enums serialize to 0, 1, 2, which makes JSON responses obscure. String enums serialize directly to clear strings like `'sunny'`."
        }
      },
      {
        heading: "Live Reloading with ts-node-dev",
        text: "`ts-node-dev` restarts the development server whenever `.ts` files change, functioning similarly to `nodemon` with native TypeScript support.",
        codeSnippet: `// In package.json:\n// "scripts": {\n//   "dev": "ts-node-dev --respawn --transpile-only src/index.ts"\n// }`,
        mcq: {
          id: "q-9.3-5-v1",
          question: "What is the benefit of the `--transpile-only` flag when running `ts-node-dev`?",
          options: [
            { id: "A", text: "It skips full type checking during file changes to ensure rapid server restarts, leaving type checking to IDE or tsc" },
            { id: "B", text: "It converts TypeScript into Python code" },
            { id: "C", text: "It disables all console.log output" },
            { id: "D", text: "It prevents memory consumption" }
          ],
          correctAnswer: "A",
          explanationNote: "`--transpile-only` dramatically speeds up rebuilds during development by only transpiling syntax, letting your code editor handle live type checking."
        },
        retestMcq: {
          id: "q-9.3-5-v2",
          question: "What does the `--respawn` flag in `ts-node-dev` do?",
          options: [
            { id: "A", text: "It keeps watching for file changes and restarts the server even if the process exited with an error" },
            { id: "B", text: "It restarts the entire operating system on error" },
            { id: "C", text: "It clears all database tables" },
            { id: "D", text: "It creates a backup of the source code directory" }
          ],
          correctAnswer: "A",
          explanationNote: "`--respawn` ensures that if your code crashes with a syntax error or exception, `ts-node-dev` keeps watching and restarts once you save the fix."
        }
      }
    ]
  },
  {
    id: "9-4-narrowing-unions-zod",
    number: "9.4",
    title: "Type Narrowing, Discriminated Unions & Zod Validation",
    subtitle: "Validate runtime data safely using custom type guards, discriminated union patterns, and schema validation with Zod.",
    readTime: "12 min",
    objectives: [
      "Narrow types using JavaScript operators (typeof, instanceof, in)",
      "Write custom type guard functions with type predicates (param is Type)",
      "Design and exhaustively check discriminated union structures",
      "Explain why TypeScript compile-time types cannot validate untrusted HTTP input alone",
      "Define runtime validation schemas using the Zod validation library",
      "Infer TypeScript types automatically from Zod schemas with z.infer"
    ],
    theoryBlocks: [
      {
        heading: "The Limits of Compile-Time Types",
        text: "TypeScript types do not exist at runtime; incoming HTTP request bodies are untrusted data that must be validated at runtime before processing.",
        codeSnippet: `// req.body is 'any' or 'unknown' at runtime!\n// Even if you cast 'req.body as NewEntry', invalid data won't be caught without runtime checks!`,
        mcq: {
          id: "q-9.4-0-v1",
          question: "Why is type assertion (`as NewEntry`) insufficient for validating incoming HTTP request bodies?",
          options: [
            { id: "A", text: "Type assertions are erased at compile time and perform zero runtime validation on actual incoming JSON" },
            { id: "B", text: "Because `as` can only be used on string types" },
            { id: "C", text: "Because Express does not allow type assertions" },
            { id: "D", text: "Because TypeScript crashes when `as` is used" }
          ],
          correctAnswer: "A",
          explanationNote: "Type assertion (`as`) simply tells the compiler 'trust me'. It generates no runtime checking code, meaning malicious or malformed data passes through undetected."
        },
        retestMcq: {
          id: "q-9.4-0-v2",
          question: "What is the recommended approach for safely handling untrusted data from an HTTP request in TypeScript?",
          options: [
            { id: "A", text: "Validate the data at runtime using type guards or a validation library like Zod before assigning it to typed variables" },
            { id: "B", text: "Cast the data to `any` and ignore errors" },
            { id: "C", text: "Use `JSON.stringify` twice" },
            { id: "D", text: "Store the raw string in an environment variable" }
          ],
          correctAnswer: "A",
          explanationNote: "Runtime validation (via type guards or schema libraries like Zod) ensures data matches the expected shape before your typed business logic runs."
        }
      },
      {
        heading: "Custom Type Guards with Type Predicates",
        text: "A type guard function returns a type predicate (`param is Type`) that informs TypeScript that a variable has been verified to be of that type.",
        codeSnippet: `const isString = (text: unknown): text is string => {\n  return typeof text === 'string' || text instanceof String;\n};\nconst isWeather = (param: string): param is Weather => {\n  return Object.values(Weather).map(v => v.toString()).includes(param);\n};`,
        mcq: {
          id: "q-9.4-1-v1",
          question: "In the function signature `const isString = (text: unknown): text is string => ...`, what is `text is string`?",
          options: [
            { id: "A", text: "A type predicate that narrows `text` to `string` in any block where `isString(text)` returns true" },
            { id: "B", text: "A runtime boolean check compiled into Node.js" },
            { id: "C", text: "A syntax error in TypeScript" },
            { id: "D", text: "A database query parameter" }
          ],
          correctAnswer: "A",
          explanationNote: "A type predicate (`arg is Type`) tells the TypeScript compiler that if the function returns `true`, the argument is definitely of type `Type`."
        },
        retestMcq: {
          id: "q-9.4-1-v2",
          question: "What does TypeScript do inside an `if (isString(value))` block?",
          options: [
            { id: "A", text: "It narrows the type of `value` from `unknown` to `string`, allowing string methods like `.toUpperCase()`" },
            { id: "B", text: "It converts `value` into a number" },
            { id: "C", text: "It skips the block if value is uppercase" },
            { id: "D", text: "It runs the block in a separate thread" }
          ],
          correctAnswer: "A",
          explanationNote: "The type guard narrows the type within the conditional block, making all `string` methods immediately accessible without compiler warnings."
        }
      },
      {
        heading: "Discriminated Unions Pattern",
        text: "A discriminated union uses a common literal property (the 'discriminant' tag) to allow TypeScript to narrow union members automatically.",
        codeSnippet: `interface CoursePartBase { name: string; exerciseCount: number; }\ninterface CoursePartBasic extends CoursePartBase { kind: "basic"; description: string; }\ninterface CoursePartGroup extends CoursePartBase { kind: "group"; groupProjectCount: number; }\ntype CoursePart = CoursePartBasic | CoursePartGroup;`,
        mcq: {
          id: "q-9.4-2-v1",
          question: "In the discriminated union `CoursePart`, what role does the property `kind` serve?",
          options: [
            { id: "A", text: "The discriminant (or tag) that distinguishes which specific interface an object belongs to" },
            { id: "B", text: "An arbitrary description for human readers only" },
            { id: "C", text: "A primary key index for MongoDB" },
            { id: "D", text: "A CSS class selector" }
          ],
          correctAnswer: "A",
          explanationNote: "The common literal field `kind` serves as the discriminant tag, allowing TypeScript to narrow the union in `switch (part.kind)` blocks."
        },
        retestMcq: {
          id: "q-9.4-2-v2",
          question: "What happens when you check `switch (part.kind)` in a function accepting `CoursePart`?",
          options: [
            { id: "A", text: "Inside `case 'basic':`, TypeScript narrows `part` to `CoursePartBasic`, making `part.description` accessible" },
            { id: "B", text: "TypeScript throws a compile error that `kind` is ambiguous" },
            { id: "C", text: "The switch statement compiles into an SQL query" },
            { id: "D", text: "It converts all properties to strings" }
          ],
          correctAnswer: "A",
          explanationNote: "TypeScript automatically narrows the union member based on the matched literal case, giving type-safe access to variant-specific fields."
        }
      },
      {
        heading: "Exhaustive Type Checking with never",
        text: "Using a helper with the `never` type in the `default` case ensures that adding a new union variant causes a compile-time error until handled.",
        codeSnippet: `const assertNever = (value: never): never => {\n  throw new Error(\`Unhandled discriminated union member: \${JSON.stringify(value)}\`);\n};\nswitch (part.kind) {\n  case "basic": return ...;\n  case "group": return ...;\n  default: return assertNever(part); // Compile error if a case is missing!\n}`,
        mcq: {
          id: "q-9.4-3-v1",
          question: "What is the purpose of passing an unhandled union case to `assertNever(value: never)`?",
          options: [
            { id: "A", text: "It provides compile-time exhaustive type checking; if a new union variant is added and not handled, compilation fails" },
            { id: "B", text: "To prevent memory leaks in V8" },
            { id: "C", text: "To restart the Express server on error" },
            { id: "D", text: "To encrypt the unhandled value" }
          ],
          correctAnswer: "A",
          explanationNote: "The `never` type represents values that can never occur. If an unhandled case reaches `default`, TypeScript fails to compile because the variant cannot be assigned to `never`."
        },
        retestMcq: {
          id: "q-9.4-3-v2",
          question: "What does the `never` primitive type in TypeScript signify?",
          options: [
            { id: "A", text: "The type of values that never occur (e.g. the return type of a function that always throws an exception)" },
            { id: "B", text: "A type that can accept any number or string" },
            { id: "C", text: "An optional parameter in an interface" },
            { id: "D", text: "A variable that has timed out" }
          ],
          correctAnswer: "A",
          explanationNote: "`never` is the bottom type in TypeScript: it has no values and represents code that should be unreachable or functions that never return."
        }
      },
      {
        heading: "Introduction to Zod Schema Validation",
        text: "Zod is a TypeScript-first schema declaration and validation library that validates runtime data and produces strongly typed output.",
        codeSnippet: `import { z } from 'zod';\nconst NewEntrySchema = z.object({\n  date: z.string().date(),\n  weather: z.nativeEnum(Weather),\n  visibility: z.nativeEnum(Visibility),\n  comment: z.string().optional()\n});\nconst parsed = NewEntrySchema.parse(req.body);`,
        mcq: {
          id: "q-9.4-4-v1",
          question: "What does `schema.parse(data)` in Zod do when given invalid input?",
          options: [
            { id: "A", text: "It throws a `ZodError` containing detailed validation error issues" },
            { id: "B", text: "It returns `null` silently" },
            { id: "C", text: "It converts invalid fields into empty arrays" },
            { id: "D", text: "It ignores the error and proceeds" }
          ],
          correctAnswer: "A",
          explanationNote: "`parse()` strictly validates the input: if valid, it returns the typed value; if invalid, it throws a `ZodError` detailing all failures."
        },
        retestMcq: {
          id: "q-9.4-4-v2",
          question: "Which method in Zod validates data WITHOUT throwing an exception on failure?",
          options: [
            { id: "A", text: "`safeParse()` (returns `{ success: true, data }` or `{ success: false, error }`)" },
            { id: "B", text: "`tryParse()`" },
            { id: "C", text: "`check()`" },
            { id: "D", text: "`validateSilent()`" }
          ],
          correctAnswer: "A",
          explanationNote: "`safeParse()` returns a result object with a `success` boolean, allowing safe inspection of errors without needing a try-catch block."
        }
      },
      {
        heading: "Inferring TypeScript Types with z.infer",
        text: "Zod eliminates duplicate type declarations by allowing TypeScript types to be inferred directly from schemas using `z.infer<typeof schema>`.",
        codeSnippet: `const EntrySchema = z.object({ name: z.string(), score: z.number() });\n// Automatically infers: type Entry = { name: string; score: number; }\ntype Entry = z.infer<typeof EntrySchema>;`,
        mcq: {
          id: "q-9.4-5-v1",
          question: "What is the benefit of `type NewEntry = z.infer<typeof NewEntrySchema>;`?",
          options: [
            { id: "A", text: "It creates a TypeScript type from the Zod schema automatically, avoiding duplicate type and schema definitions" },
            { id: "B", text: "It validates database migrations" },
            { id: "C", text: "It minifies client-side bundle code" },
            { id: "D", text: "It compiles TypeScript directly to WebAssembly" }
          ],
          correctAnswer: "A",
          explanationNote: "`z.infer` establishes a single source of truth: you define the schema once, and TypeScript automatically generates the matching static type."
        },
        retestMcq: {
          id: "q-9.4-5-v2",
          question: "What happens to your inferred TypeScript types when you update a Zod schema?",
          options: [
            { id: "A", text: "All inferred types update automatically, immediately reflecting changes across your codebase" },
            { id: "B", text: "You must run an npm code generator script" },
            { id: "C", text: "The database table is dropped and recreated" },
            { id: "D", text: "TypeScript throws a duplicate definition error" }
          ],
          correctAnswer: "A",
          explanationNote: "Because `z.infer` directly infers from the schema, any update to schema fields immediately cascades across all TypeScript types referencing it."
        }
      }
    ]
  },
  {
    id: "9-5-react-with-typescript",
    number: "9.5",
    title: "React with TypeScript: Props, State & Events",
    subtitle: "Build robust frontend React applications with typed component props, typed useState hooks, and synthetic form events.",
    readTime: "12 min",
    objectives: [
      "Set up Vite React projects configured with TypeScript",
      "Type component props using interfaces and type aliases",
      "Work with the useState hook and explicit generic type arguments",
      "Type React synthetic events (SyntheticEvent, ChangeEvent, FormEvent)",
      "Render typed discriminated union components safely",
      "Avoid common pitfalls with any when handling form submissions in React"
    ],
    theoryBlocks: [
      {
        heading: "Typing React Component Props",
        text: "Component props are typed using an interface or type alias, with props destructured directly in the component parameter signature.",
        codeSnippet: `interface HeaderProps {\n  name: string;\n}\nconst Header = ({ name }: HeaderProps) => {\n  return <h1>{name}</h1>;\n};`,
        mcq: {
          id: "q-9.5-0-v1",
          question: "What is the idiomatic way to type props in a modern React function component with TypeScript?",
          options: [
            { id: "A", text: "Declare an interface for props and annotate the destructured parameters: `({ name }: HeaderProps)`" },
            { id: "B", text: "Use PropTypes exclusively" },
            { id: "C", text: "Assign the component to `any`" },
            { id: "D", text: "Declare props in HTML meta tags" }
          ],
          correctAnswer: "A",
          explanationNote: "Direct parameter annotation `({ name }: HeaderProps)` provides clean, standard prop typing with autocomplete and type checking in modern React."
        },
        retestMcq: {
          id: "q-9.5-0-v2",
          question: "What happens if a parent component omits a required prop when rendering `<Header />`?",
          options: [
            { id: "A", text: "TypeScript flags a compile-time error stating that required property is missing" },
            { id: "B", text: "The browser tab crashes at runtime" },
            { id: "C", text: "React supplies an empty string without warning" },
            { id: "D", text: "The component does not mount" }
          ],
          correctAnswer: "A",
          explanationNote: "TypeScript verifies that all required props defined in the interface are supplied by the caller, preventing missing prop bugs at compile time."
        }
      },
      {
        heading: "The useState Hook with Generics",
        text: "When initial state cannot determine the full type (e.g. starting as an empty array or null), pass a generic type argument to `useState<T>`.",
        codeSnippet: `// Inferred as DiaryEntry[]\nconst [diaries, setDiaries] = useState<DiaryEntry[]>([]);\n// State that can be null initially:\nconst [user, setUser] = useState<User | null>(null);`,
        mcq: {
          id: "q-9.5-1-v1",
          question: "Why should you write `useState<DiaryEntry[]>([])` instead of `useState([])`?",
          options: [
            { id: "A", text: "Without the generic, TypeScript infers `never[]`, preventing you from adding any DiaryEntry items to state" },
            { id: "B", text: "Because React crashes if `useState([])` is used" },
            { id: "C", text: "To make the array read-only" },
            { id: "D", text: "To automatically fetch diary entries from the server" }
          ],
          correctAnswer: "A",
          explanationNote: "`useState([])` infers `never[]` because the array is empty. Passing `<DiaryEntry[]>` tells TypeScript what elements the array is meant to hold."
        },
        retestMcq: {
          id: "q-9.5-1-v2",
          question: "How do you type a `useState` variable that starts as `null` but later holds a `User` object?",
          options: [
            { id: "A", text: "`useState<User | null>(null)`" },
            { id: "B", text: "`useState<null>(User)`" },
            { id: "C", text: "`useState(User = null)`" },
            { id: "D", text: "`useState.asNull<User>()`" }
          ],
          correctAnswer: "A",
          explanationNote: "Using a union generic `<User | null>` allows state to cleanly hold `null` before data loads and a `User` object once loaded."
        }
      },
      {
        heading: "Typing React Synthetic Events",
        text: "React wraps native browser events in synthetic event objects; form submissions use `React.SyntheticEvent` and input changes use `React.ChangeEvent`.",
        codeSnippet: `const entryCreation = (event: React.SyntheticEvent) => {\n  event.preventDefault();\n  // process form submission\n};\nconst handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {\n  setDate(event.target.value);\n};`,
        mcq: {
          id: "q-9.5-2-v1",
          question: "Which type should you use to annotate the event parameter in a form submit handler `(event) => event.preventDefault()`?",
          options: [
            { id: "A", text: "`React.SyntheticEvent` (or `React.FormEvent`)" },
            { id: "B", text: "`EventTarget`" },
            { id: "C", text: "`MouseEvent`" },
            { id: "D", text: "`string`" }
          ],
          correctAnswer: "A",
          explanationNote: "`React.SyntheticEvent` (or `React.FormEvent`) provides access to React's cross-browser event wrapper methods like `preventDefault()`."
        },
        retestMcq: {
          id: "q-9.5-2-v2",
          question: "What is the correct event type for an input's `onChange` handler in React with TypeScript?",
          options: [
            { id: "A", text: "`React.ChangeEvent<HTMLInputElement>`" },
            { id: "B", text: "`React.InputEvent`" },
            { id: "C", text: "`KeyboardEvent<string>`" },
            { id: "D", text: "`HTMLInputElement.change`" }
          ],
          correctAnswer: "A",
          explanationNote: "`React.ChangeEvent<HTMLInputElement>` specifies that the event originates from an HTML `<input>` element, ensuring `event.target.value` is typed as `string`."
        }
      },
      {
        heading: "Rendering Discriminated Unions in React",
        text: "A component can accept a discriminated union prop and use a `switch` statement to render distinct UI layouts for each variant.",
        codeSnippet: `const Part = ({ part }: { part: CoursePart }) => {\n  switch (part.kind) {\n    case "basic": return <p>{part.name} {part.exerciseCount}: {part.description}</p>;\n    case "group": return <p>{part.name} projects: {part.groupProjectCount}</p>;\n    default: return assertNever(part);\n  }\n};`,
        mcq: {
          id: "q-9.5-3-v1",
          question: "Why is rendering a discriminated union with a `switch` statement so effective in React components?",
          options: [
            { id: "A", text: "TypeScript automatically narrows the props within each case branch, ensuring only valid fields for that variant are rendered" },
            { id: "B", text: "It executes faster than if-else statements in the browser" },
            { id: "C", text: "It compiles the component to a WebGL shader" },
            { id: "D", text: "It bypasses the React Virtual DOM" }
          ],
          correctAnswer: "A",
          explanationNote: "The switch on the discriminant tag allows TypeScript to guarantee that variant-specific props (like `groupProjectCount`) are only accessed on the correct component."
        },
        retestMcq: {
          id: "q-9.5-3-v2",
          question: "What happens if a new course part variant (e.g. `kind: \"special\"`) is added to the union but not handled in `Part`?",
          options: [
            { id: "A", text: "The `default: return assertNever(part);` line produces a compile-time type error" },
            { id: "B", text: "React renders a blank white page" },
            { id: "C", text: "The browser console logs a warning but compilation succeeds" },
            { id: "D", text: "TypeScript converts the component into plain HTML" }
          ],
          correctAnswer: "A",
          explanationNote: "Because of `assertNever`, unhandled variants fall through to `default` where TypeScript catches the oversight at compile time."
        }
      },
      {
        heading: "Using Axios with TypeScript in React",
        text: "Pass a generic type to Axios methods (e.g. `axios.get<DiaryEntry[]>`) to type the returned `response.data` payload.",
        codeSnippet: `import axios from 'axios';\nuseEffect(() => {\n  axios.get<DiaryEntry[]>('/api/diaries').then(response => {\n    // response.data is typed as DiaryEntry[]\n    setDiaries(response.data);\n  });\n}, []);`,
        mcq: {
          id: "q-9.5-4-v1",
          question: "What does `axios.get<DiaryEntry[]>('/api/diaries')` do in TypeScript?",
          options: [
            { id: "A", text: "It types the `response.data` property as `DiaryEntry[]`" },
            { id: "B", text: "It forces the server to return TypeScript source code" },
            { id: "C", text: "It verifies the data at runtime using Zod" },
            { id: "D", text: "It deletes duplicate entries from the array" }
          ],
          correctAnswer: "A",
          explanationNote: "Providing generic type `<DiaryEntry[]>` to `axios.get` assigns that type to `response.data`, providing autocomplete and type safety."
        },
        retestMcq: {
          id: "q-9.5-4-v2",
          question: "How do you narrow Axios error objects when handling API call failures in React?",
          options: [
            { id: "A", text: "`if (axios.isAxiosError(error)) { console.log(error.response?.data); }`" },
            { id: "B", text: "`if (typeof error === 'axios')`" },
            { id: "C", text: "`if (error.isHttpError)`" },
            { id: "D", text: "`error.toAxios()`" }
          ],
          correctAnswer: "A",
          explanationNote: "`axios.isAxiosError(error)` is Axios's built-in type guard that safely narrows `error` to `AxiosError`, giving type-safe access to `error.response`."
        }
      },
      {
        heading: "Strict Null Checks in React Components",
        text: "With `strictNullChecks`, TypeScript requires checking whether nullable state is null before accessing properties, eliminating 'Cannot read properties of null' errors.",
        codeSnippet: `if (!patient) return <div>Patient not found</div>;\n// Below this line, TypeScript knows patient is NOT null\nreturn <div><h2>{patient.name} ({patient.gender})</h2></div>;`,
        mcq: {
          id: "q-9.5-5-v1",
          question: "How does TypeScript's `strictNullChecks` prevent runtime errors in React components?",
          options: [
            { id: "A", text: "It prevents accessing properties on variables that could be `null` or `undefined` without an explicit guard" },
            { id: "B", text: "It automatically fills null variables with mock data" },
            { id: "C", text: "It skips rendering components that return null" },
            { id: "D", text: "It converts all null values into 0" }
          ],
          correctAnswer: "A",
          explanationNote: "`strictNullChecks` forces you to handle `null` or `undefined` states before accessing properties, preventing standard JavaScript runtime null reference errors."
        },
        retestMcq: {
          id: "q-9.5-5-v2",
          question: "What optional chaining operator allows safe access to deeply nested properties that might be null or undefined?",
          options: [
            { id: "A", text: "`?.` (e.g. `patient?.entries?.length`)" },
            { id: "B", text: "`!!`" },
            { id: "C", text: "`->`" },
            { id: "D", text: "`::`" }
          ],
          correctAnswer: "A",
          explanationNote: "The optional chaining operator `?.` short-circuits to `undefined` if the operand before `?.` is `null` or `undefined`."
        }
      }
    ]
  },
  {
    id: "9-6-fullstack-typescript-app",
    number: "9.6",
    title: "Full Stack TypeScript Application & Capstone",
    subtitle: "Architect production end-to-end typed systems sharing interfaces between Express and React with end-to-end type safety.",
    readTime: "12 min",
    objectives: [
      "Share TypeScript interfaces and types between backend Express and frontend React",
      "Structure multi-package monorepos or shared type modules cleanly",
      "Implement robust type-safe REST communication between client and server",
      "Apply defensive type guards and schema parsing across full stack boundaries",
      "Deploy compiled JavaScript bundles produced by tsc to production environments",
      "Synthesize core Full Stack Open concepts: React, Node, Express, GraphQL, and TypeScript"
    ],
    theoryBlocks: [
      {
        heading: "End-to-End Type Safety Architecture",
        text: "Sharing domain interfaces between the frontend and backend ensures that API contract changes trigger compile-time errors in both apps immediately.",
        codeSnippet: `// Shared types file imported by both server and client:\nexport interface Patient {\n  id: string;\n  name: string;\n  dateOfBirth: string;\n  ssn: string;\n  gender: Gender;\n  occupation: string;\n  entries: Entry[];\n}`,
        mcq: {
          id: "q-9.6-0-v1",
          question: "What is the primary benefit of sharing type definitions between frontend and backend codebases?",
          options: [
            { id: "A", text: "Changes to API data contracts produce compile-time type errors on both client and server before deployment" },
            { id: "B", text: "It compresses the backend database" },
            { id: "C", text: "It eliminates the need for HTTP communication" },
            { id: "D", text: "It allows React to run inside Node.js natively" }
          ],
          correctAnswer: "A",
          explanationNote: "Sharing types ensures that if an API property name or type changes on the server, the compiler immediately highlights broken references on the client."
        },
        retestMcq: {
          id: "q-9.6-0-v2",
          question: "How can shared types be structured in a full stack project?",
          options: [
            { id: "A", text: "In a shared types directory, a shared npm workspace, or a monorepo package" },
            { id: "B", text: "By committing compiled `.js` files into Git" },
            { id: "C", text: "By encoding types into URL query strings" },
            { id: "D", text: "Inside the browser's cookies" }
          ],
          correctAnswer: "A",
          explanationNote: "Shared type definitions are often kept in a shared workspace package or directory imported by both backend and frontend projects."
        }
      },
      {
        heading: "Complex Discriminated Unions in Healthcare (Patientor)",
        text: "In the course's Patientor project, the `Entry` type is a discriminated union of `HospitalEntry`, `OccupationalHealthcareEntry`, and `HealthCheckEntry`.",
        codeSnippet: `export type Entry =\n  | HospitalEntry\n  | OccupationalHealthcareEntry\n  | HealthCheckEntry;\n// Each variant has a distinct literal: type: "Hospital" | "OccupationalHealthcare" | "HealthCheck"`,
        mcq: {
          id: "q-9.6-1-v1",
          question: "In the Patientor course project, why is `Entry` modeled as a discriminated union rather than a single interface with many optional fields?",
          options: [
            { id: "A", text: "Each entry type has mutually exclusive required properties (e.g. discharge vs healthCheckRating) that must be enforced strictly" },
            { id: "B", text: "Because TypeScript interfaces cannot have more than 4 properties" },
            { id: "C", text: "To encrypt medical records" },
            { id: "D", text: "Because MongoDB does not support optional fields" }
          ],
          correctAnswer: "A",
          explanationNote: "Modeling variants as a discriminated union ensures that `HospitalEntry` must have `discharge` while `HealthCheckEntry` must have `healthCheckRating`."
        },
        retestMcq: {
          id: "q-9.6-1-v2",
          question: "When rendering a list of `Entry` items in React, what discriminant property identifies the entry variant?",
          options: [
            { id: "A", text: "`entry.type` (e.g. `entry.type === 'Hospital'`)" },
            { id: "B", text: "`entry.index`" },
            { id: "C", text: "`entry.key`" },
            { id: "D", text: "`entry.variantId`" }
          ],
          correctAnswer: "A",
          explanationNote: "In Patientor, `type: 'Hospital' | 'OccupationalHealthcare' | 'HealthCheck'` acts as the discriminant tag for type narrowing."
        }
      },
      {
        heading: "Type-Safe Form Submission Across the Stack",
        text: "Form data gathered in React is typed as `NewEntry`, transmitted via Axios, validated at runtime with Zod in Express, and stored in the database.",
        codeSnippet: `// Frontend:\nconst submitNewEntry = async (values: EntryFormValues) => {\n  const newEntry = await patientService.createEntry(id, values);\n  setPatient({ ...patient, entries: patient.entries.concat(newEntry) });\n};`,
        mcq: {
          id: "q-9.6-2-v1",
          question: "In a type-safe full stack application, what role does Zod play when the Express server receives `values` from React?",
          options: [
            { id: "A", text: "It verifies at runtime that the incoming JSON payload strictly adheres to the schema before any database operations" },
            { id: "B", text: "It compresses the incoming JSON into gzip" },
            { id: "C", text: "It renders HTML templates" },
            { id: "D", text: "It replaces Express routing" }
          ],
          correctAnswer: "A",
          explanationNote: "Even with TypeScript on the frontend, anyone can send raw HTTP requests; server-side Zod validation guarantees runtime data integrity."
        },
        retestMcq: {
          id: "q-9.6-2-v2",
          question: "If the server throws a validation error during submission, how should the typed React frontend display the message?",
          options: [
            { id: "A", text: "Extract the error message using `axios.isAxiosError(e)` and display it in a user-facing notification banner" },
            { id: "B", text: "Reload the page with `window.location.reload()`" },
            { id: "C", text: "Crash the application" },
            { id: "D", text: "Silently retry 1,000 times" }
          ],
          correctAnswer: "A",
          explanationNote: "Safely inspecting the error with `isAxiosError` lets you extract server-provided validation messages and present them cleanly to users."
        }
      },
      {
        heading: "Building for Production: Compilation & Assets",
        text: "Production deployment compiles backend TypeScript with `tsc` to a `dist` folder and builds frontend React using `vite build` into static assets.",
        codeSnippet: `// package.json scripts:\n// "build": "tsc",\n// "start": "node build/index.js"`,
        mcq: {
          id: "q-9.6-3-v1",
          question: "What command executes the compiled production backend after `npm run build` (`tsc`) completes?",
          options: [
            { id: "A", text: "`node dist/index.js` (or `node build/index.js`)" },
            { id: "B", text: "`npx ts-node src/index.ts`" },
            { id: "C", text: "`vite preview`" },
            { id: "D", text: "`tsc --watch`" }
          ],
          correctAnswer: "A",
          explanationNote: "Production environments run the transpiled JavaScript files directly with `node`, without compilation overhead or TypeScript tooling in production."
        },
        retestMcq: {
          id: "q-9.6-3-v2",
          question: "Why should `sourceMap: true` be enabled in `tsconfig.json` for production builds?",
          options: [
            { id: "A", text: "It enables production error stack traces to reference original TypeScript files and line numbers rather than compiled JS" },
            { id: "B", text: "It makes JavaScript files run 50% faster" },
            { id: "C", text: "It is required to serve CSS files" },
            { id: "D", text: "It converts SQL queries into MongoDB documents" }
          ],
          correctAnswer: "A",
          explanationNote: "Source maps map compiled JavaScript lines back to their source TypeScript lines, making production logs and debugging far clearer."
        }
      },
      {
        heading: "TypeScript Monorepo & Code Sharing",
        text: "A monorepo structure allows client and server packages to share a common `types` package, maintaining consistency across the entire repository.",
        codeSnippet: `// Monorepo Structure:\n// ├── packages/\n// │   ├── shared-types/\n// │   ├── backend/\n// │   └── frontend/`,
        mcq: {
          id: "q-9.6-4-v1",
          question: "What is a major advantage of a monorepo when developing full stack TypeScript applications?",
          options: [
            { id: "A", text: "It allows client, server, and shared types to live in a single repository with synchronized versioning and type checks" },
            { id: "B", text: "It merges frontend and backend into a single JavaScript file" },
            { id: "C", text: "It bypasses all npm package installations" },
            { id: "D", text: "It prevents other developers from editing code" }
          ],
          correctAnswer: "A",
          explanationNote: "Monorepos allow sharing code and type definitions seamlessly, ensuring any contract update is immediately checked across both backend and frontend."
        },
        retestMcq: {
          id: "q-9.6-4-v2",
          question: "Which npm feature supports managing multiple packages within a single repository?",
          options: [
            { id: "A", text: "npm Workspaces" },
            { id: "B", text: "npm Clusters" },
            { id: "C", text: "npm Partitions" },
            { id: "D", text: "npm Duplex" }
          ],
          correctAnswer: "A",
          explanationNote: "npm Workspaces provide native support for managing multiple packages within a single top-level root package."
        }
      },
      {
        heading: "Full Stack Open Capstone Summary",
        text: "By mastering Part 9, you have conquered the full modern web stack: React components, state, Node/Express backends, MongoDB, GraphQL, and end-to-end TypeScript.",
        codeSnippet: `// Full Stack Open Stack:\n// Frontend: React + TypeScript + Vite + Redux / React Query\n// Backend: Node.js + Express + TypeScript + Mongoose / GraphQL\n// Quality: Jest + Supertest + Playwright + CI/CD`,
        mcq: {
          id: "q-9.6-5-v1",
          question: "How does TypeScript enhance the overall Full Stack Open architecture built from Part 0 through Part 9?",
          options: [
            { id: "A", text: "By adding compile-time correctness, rich autocomplete, and contract guarantees across both React frontends and Node backends" },
            { id: "B", text: "By replacing the need for any unit or end-to-end tests" },
            { id: "C", text: "By converting all relational databases into MongoDB" },
            { id: "D", text: "By eliminating the need for CSS" }
          ],
          correctAnswer: "A",
          explanationNote: "TypeScript solidifies the entire web development lifecycle: refactoring is fearless, APIs are strictly typed, and bugs are eliminated before code ships."
        },
        retestMcq: {
          id: "q-9.6-5-v2",
          question: "What is the primary takeaway of static type systems in enterprise web applications?",
          options: [
            { id: "A", text: "They transform runtime surprises into compile-time feedback, enabling scalable, maintainable architectures" },
            { id: "B", text: "They eliminate the need for version control" },
            { id: "C", text: "They restrict web apps to desktop computers" },
            { id: "D", text: "They force all web developers to use only one framework" }
          ],
          correctAnswer: "A",
          explanationNote: "Static typing provides automatic documentation, verified API contracts, and instant compiler warnings, making large applications robust and maintainable."
        }
      }
    ]
  }
];

// Helper functions for student attempt tracking and failure streak logic
export const getLevelAttemptCountFullstackPart9 = (sectionId: string, studentId: string): number => {
  try {
    const key = `dopilot_fullstack_p9_attempt_${sectionId}_${studentId}`;
    const saved = localStorage.getItem(key);
    return saved ? Number(saved) : 1;
  } catch {
    return 1;
  }
};

export const setLevelAttemptCountFullstackPart9 = (sectionId: string, studentId: string, count: number): void => {
  try {
    const key = `dopilot_fullstack_p9_attempt_${sectionId}_${studentId}`;
    localStorage.setItem(key, String(count));
  } catch {}
};

export const getActiveQuestionsForLevelFullstackPart9 = (
  section: SectionContent,
  studentId: string,
  forceRetest: boolean = false
): McqQuestion[] => {
  const attempt = forceRetest ? 2 : getLevelAttemptCountFullstackPart9(section.id, studentId);
  return section.theoryBlocks.map((block) => {
    if (attempt >= 2 && block.retestMcq) {
      return block.retestMcq;
    }
    return block.mcq!;
  });
};

export const getConsecutiveFailedLevelsFullstackPart9 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_fullstack_p9_failed_levels_streak_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const isLevelLockedFullstackPart9 = (studentId: string): boolean => {
  try {
    return localStorage.getItem(`dopilot_fullstack_p9_locked_${studentId}`) === 'true';
  } catch {
    return false;
  }
};

export const recordLevelAttemptResultFullstackPart9 = (
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
  const currentAttempt = getLevelAttemptCountFullstackPart9(sectionId, studentId);

  if (isPassed) {
    try {
      localStorage.setItem(`dopilot_fullstack_p9_failed_levels_streak_${studentId}`, '0');
      localStorage.setItem(`dopilot_fullstack_p9_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_fullstack_p9_attempt_${sectionId}_${studentId}`, '1');
      localStorage.removeItem(`dopilot_fullstack_p9_locked_${studentId}`);
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
      setLevelAttemptCountFullstackPart9(sectionId, studentId, 2);
      const streak = getConsecutiveFailedLevelsFullstackPart9(studentId);

      return {
        isPassed: false,
        attemptCount: 1,
        isSecondFailureInLevel: false,
        consecutiveFailedLevels: streak,
        isLocked: false
      };
    } else {
      const prevStreak = getConsecutiveFailedLevelsFullstackPart9(studentId);
      const newStreak = prevStreak + 1;
      const isLocked = newStreak >= 3;

      try {
        localStorage.setItem(`dopilot_fullstack_p9_failed_levels_streak_${studentId}`, String(newStreak));
        localStorage.setItem(`dopilot_fullstack_p9_consecutive_failures_${studentId}`, String(newStreak));
        if (isLocked) {
          localStorage.setItem(`dopilot_fullstack_p9_locked_${studentId}`, 'true');
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

export const resetConsecutiveFailuresFullstackPart9 = (studentId: string): void => {
  try {
    localStorage.setItem(`dopilot_fullstack_p9_consecutive_failures_${studentId}`, '0');
    localStorage.setItem(`dopilot_fullstack_p9_failed_levels_streak_${studentId}`, '0');
    localStorage.removeItem(`dopilot_fullstack_p9_locked_${studentId}`);
  } catch {}
};
