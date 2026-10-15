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

export const FULLSTACK_PART_8_SECTIONS: SectionContent[] = [
  {
    id: "8-1-graphql-server-basics",
    number: "8.1",
    title: "GraphQL Server: Schemas, Types & Queries",
    subtitle: "Define schemas, scalar types, and query resolvers using Apollo Server to serve precisely requested data.",
    readTime: "12 min",
    objectives: [
      "Contrast GraphQL single-endpoint architecture against traditional multi-endpoint REST APIs",
      "Declare schema definitions with Schema Definition Language (SDL) and the Query root type",
      "Implement resolver functions that fulfill specific field queries",
      "Work with GraphQL scalar types and mandatory non-nullable modifiers",
      "Pass parameters and arguments into GraphQL query fields",
      "Run and debug queries using Apollo Server and Apollo Sandbox"
    ],
    theoryBlocks: [
      {
        heading: "GraphQL Paradigm vs REST",
        text: "GraphQL uses a single HTTP POST endpoint where clients declare the exact fields they need, eliminating REST over-fetching and under-fetching.",
        codeSnippet: `// Single endpoint POST /graphql\nquery { allPersons { name phone } } // client gets ONLY name & phone`,
        mcq: {
          id: "q-8.1-0-v1",
          question: "What primary problem of REST APIs does GraphQL solve by allowing clients to specify query fields?",
          options: [
            { id: "A", text: "It prevents over-fetching and under-fetching of server data" },
            { id: "B", text: "It eliminates the need for any server-side database" },
            { id: "C", text: "It converts all HTTP requests to synchronous TCP sockets" },
            { id: "D", text: "It replaces JavaScript runtime with browser WebAssembly" }
          ],
          correctAnswer: "A",
          explanationNote: "In REST, endpoints return fixed payloads leading to over-fetching (too much data) or under-fetching (multiple round-trips). GraphQL lets the client query only requested fields."
        },
        retestMcq: {
          id: "q-8.1-0-v2",
          question: "Unlike REST which typically exposes multiple endpoints (/api/users, /api/posts), how does GraphQL structure its API interface?",
          options: [
            { id: "A", text: "It usually exposes a single HTTP POST endpoint accepting declarative query documents" },
            { id: "B", text: "It requires a separate HTTP port for each distinct database table" },
            { id: "C", text: "It exclusively communicates through static HTML file generation" },
            { id: "D", text: "It exposes only GET endpoints with URL encoded binary streams" }
          ],
          correctAnswer: "A",
          explanationNote: "Standard GraphQL server implementations expose a single endpoint (commonly /graphql via POST) through which all operations are submitted."
        }
      },
      {
        heading: "Schema Definition Language (SDL)",
        text: "The schema describes the data model and available operations using SDL, where the root type `Query` lists all fetchable queries.",
        codeSnippet: `type Person {\n  name: String!\n  phone: String\n}\ntype Query {\n  personCount: Int!\n  allPersons: [Person!]!\n}`,
        mcq: {
          id: "q-8.1-1-v1",
          question: "What does the exclamation mark '!' indicate when attached to a type in GraphQL SDL (e.g. `String!`)?",
          options: [
            { id: "A", text: "The field is non-nullable and must never return null" },
            { id: "B", text: "The field is a private variable hidden from public clients" },
            { id: "C", text: "The field is an asynchronous Promise" },
            { id: "D", text: "The field is deprecated and will be removed" }
          ],
          correctAnswer: "A",
          explanationNote: "In GraphQL SDL, the exclamation mark indicates a non-nullable type; the server guarantees a value will always be returned."
        },
        retestMcq: {
          id: "q-8.1-1-v2",
          question: "In the GraphQL type definition `allPersons: [Person!]!`, what does the outer exclamation mark guarantee?",
          options: [
            { id: "A", text: "The returned array itself cannot be null (it will be at least an empty array `[]`)" },
            { id: "B", text: "The array must always contain at least 10 items" },
            { id: "C", text: "The array cannot contain any string values" },
            { id: "D", text: "The array is immutable and read-only on the client" }
          ],
          correctAnswer: "A",
          explanationNote: "The inner `!` guarantees individual elements inside cannot be null, while the outer `!` guarantees the array list itself cannot be null."
        }
      },
      {
        heading: "Root Query Resolvers",
        text: "Resolvers are JavaScript functions that define how schema fields are populated with data from databases, memory, or third-party APIs.",
        codeSnippet: `const resolvers = {\n  Query: {\n    personCount: () => persons.length,\n    allPersons: () => persons\n  }\n};`,
        mcq: {
          id: "q-8.1-2-v1",
          question: "What is the primary role of a GraphQL resolver function?",
          options: [
            { id: "A", text: "To compute and return the concrete data for a schema field" },
            { id: "B", text: "To compile TypeScript code to browser JavaScript" },
            { id: "C", text: "To encrypt HTTP cookies before transmitting" },
            { id: "D", text: "To generate CSS layout rules dynamically" }
          ],
          correctAnswer: "A",
          explanationNote: "Resolvers provide the business logic that returns data corresponding to each field declared in the GraphQL schema."
        },
        retestMcq: {
          id: "q-8.1-2-v2",
          question: "If a field in a GraphQL query does not have an explicit custom resolver defined, how does Apollo Server resolve it by default?",
          options: [
            { id: "A", text: "It uses a default resolver that looks up the property with that name on the parent object" },
            { id: "B", text: "It throws a runtime compilation error immediately" },
            { id: "C", text: "It queries the database using an automatic raw SQL statement" },
            { id: "D", text: "It returns an empty string for all scalar types" }
          ],
          correctAnswer: "A",
          explanationNote: "GraphQL servers implement default trivial resolvers: if no custom resolver exists, it accesses `parent[fieldName]`."
        }
      },
      {
        heading: "GraphQL Built-In Scalar Types",
        text: "GraphQL provides five primitive scalar types out of the box: `String`, `Int` (32-bit signed), `Float`, `Boolean`, and `ID` (unique identifier).",
        codeSnippet: `type Book {\n  id: ID!\n  title: String!\n  published: Int!\n  rating: Float\n  inStock: Boolean!\n}`,
        mcq: {
          id: "q-8.1-3-v1",
          question: "Which of the following is NOT one of the 5 built-in scalar types in GraphQL?",
          options: [
            { id: "A", text: "DateTime" },
            { id: "B", text: "ID" },
            { id: "C", text: "Float" },
            { id: "D", text: "Int" }
          ],
          correctAnswer: "A",
          explanationNote: "The 5 built-in GraphQL scalars are Int, Float, String, Boolean, and ID. DateTime is a custom scalar that must be defined if needed."
        },
        retestMcq: {
          id: "q-8.1-3-v2",
          question: "What is the purpose of the `ID` scalar type in GraphQL SDL?",
          options: [
            { id: "A", text: "It represents a unique identifier serialized as a String, meant for object re-fetching or caching" },
            { id: "B", text: "It restricts values to strictly auto-incrementing integers" },
            { id: "C", text: "It represents an encrypted SHA-256 password hash" },
            { id: "D", text: "It marks the database primary key index exclusively in SQL" }
          ],
          correctAnswer: "A",
          explanationNote: "The ID scalar type represents a unique identifier, often used to refetch an object or as the key for a cache. It serializes as a String."
        }
      },
      {
        heading: "Query Arguments & Parameters",
        text: "GraphQL query fields can accept typed parameters to filter, sort, or paginate results directly within the resolver.",
        codeSnippet: `type Query {\n  findPerson(name: String!): Person\n}\n// Resolver receives (root, args, context, info)\nfindPerson: (root, args) => persons.find(p => p.name === args.name)`,
        mcq: {
          id: "q-8.1-4-v1",
          question: "In a resolver function `(root, args, context, info)`, where are client-provided query arguments accessed?",
          options: [
            { id: "A", text: "From the second parameter `args`" },
            { id: "B", text: "From the first parameter `root`" },
            { id: "C", text: "From `window.location.search`" },
            { id: "D", text: "From the global `process.env` variable" }
          ],
          correctAnswer: "A",
          explanationNote: "Resolver functions receive four parameters: `(root, args, context, info)`. The second argument `args` contains all arguments passed into the field."
        },
        retestMcq: {
          id: "q-8.1-4-v2",
          question: "Given `findBook(author: String, genre: String): [Book!]!`, what is true if the client passes no arguments?",
          options: [
            { id: "A", text: "In the resolver, `args.author` and `args.genre` will be undefined, so optional filtering logic must handle this" },
            { id: "B", text: "The server immediately rejects the query as invalid SDL syntax" },
            { id: "C", text: "The server defaults both arguments to empty strings automatically" },
            { id: "D", text: "The resolver will not be executed at all" }
          ],
          correctAnswer: "A",
          explanationNote: "Since neither argument has a `!` modifier, both are optional. When omitted by the client, their values in `args` are undefined."
        }
      },
      {
        heading: "Apollo Server Standalone Setup",
        text: "Using `@apollo/server` with `startStandaloneServer` launches an HTTP GraphQL server with built-in Apollo Sandbox for interactive query testing.",
        codeSnippet: `import { ApolloServer } from '@apollo/server';\nimport { startStandaloneServer } from '@apollo/server/standalone';\nconst server = new ApolloServer({ typeDefs, resolvers });\nconst { url } = await startStandaloneServer(server, { listen: { port: 4000 } });`,
        mcq: {
          id: "q-8.1-5-v1",
          question: "What are the two mandatory properties passed to `new ApolloServer({ ... })`?",
          options: [
            { id: "A", text: "typeDefs and resolvers" },
            { id: "B", text: "html and css" },
            { id: "C", text: "databaseUrl and apiKey" },
            { id: "D", text: "routes and controllers" }
          ],
          correctAnswer: "A",
          explanationNote: "ApolloServer requires `typeDefs` (the GraphQL schema string created with gql) and `resolvers` (the object mapping operations to handler functions)."
        },
        retestMcq: {
          id: "q-8.1-5-v2",
          question: "What is Apollo Sandbox provided by Apollo Server in development mode?",
          options: [
            { id: "A", text: "A web browser GUI for introspecting the schema, composing queries, and inspecting responses" },
            { id: "B", text: "An isolated Docker container for running unit tests" },
            { id: "C", text: "A sandboxed virtual DOM compiler that replaces React" },
            { id: "D", text: "A CSS design mockup tool for styling buttons" }
          ],
          correctAnswer: "A",
          explanationNote: "Apollo Sandbox is a web-based IDE tool bundled with Apollo Server that lets developers inspect the schema, write queries, and test resolvers interactively."
        }
      }
    ]
  },
  {
    id: "8-2-mutations-and-enums",
    number: "8.2",
    title: "Mutations & Enums: Modifying Server Data",
    subtitle: "Create, update, and delete server data using GraphQL mutations, custom enums, and structured error handling.",
    readTime: "12 min",
    objectives: [
      "Define state-modifying operations under the Mutation root type in SDL",
      "Write mutation resolvers that validate, persist, and return modified records",
      "Use GraphQL enum types to restrict input options to discrete constants",
      "Raise informative validation errors using GraphQLError and BAD_USER_INPUT codes",
      "Update nested or associated records across related entities",
      "Select custom response fields in mutation operation documents"
    ],
    theoryBlocks: [
      {
        heading: "GraphQL Mutations Concept",
        text: "Mutations represent operations that create, update, or delete data on the server; they are declared under the root `type Mutation`.",
        codeSnippet: `type Mutation {\n  addPerson(name: String!, phone: String, street: String!, city: String!): Person\n}`,
        mcq: {
          id: "q-8.2-0-v1",
          question: "By GraphQL convention, which root operation type must be used when an operation modifies server state?",
          options: [
            { id: "A", text: "Mutation" },
            { id: "B", text: "Query" },
            { id: "C", text: "Subscription" },
            { id: "D", text: "Transaction" }
          ],
          correctAnswer: "A",
          explanationNote: "While queries are intended for read-only fetches, mutations are designed specifically for side-effect operations that modify data."
        },
        retestMcq: {
          id: "q-8.2-0-v2",
          question: "Unlike top-level fields in a `Query` which can execute in parallel, how does a GraphQL server execute multiple fields in a single `mutation` operation?",
          options: [
            { id: "A", text: "Serially, one after another, to prevent race conditions" },
            { id: "B", text: "In reverse alphabetical order" },
            { id: "C", text: "In separate worker threads simultaneously" },
            { id: "D", text: "Only the first field is executed; subsequent fields are discarded" }
          ],
          correctAnswer: "A",
          explanationNote: "The GraphQL specification mandates that top-level mutation fields execute serially in order to avoid race conditions when mutating data."
        }
      },
      {
        heading: "Writing Mutation Resolvers",
        text: "A mutation resolver reads arguments from `args`, modifies the data source, and returns the modified object to satisfy the selection set.",
        codeSnippet: `Mutation: {\n  addPerson: (root, args) => {\n    const person = { ...args, id: uuid() };\n    persons = persons.concat(person);\n    return person;\n  }\n}`,
        mcq: {
          id: "q-8.2-1-v1",
          question: "Why should a mutation resolver return the newly created or modified object?",
          options: [
            { id: "A", text: "So the client can immediately query desired updated fields without an additional fetch" },
            { id: "B", text: "Because GraphQL servers crash if a resolver returns an object" },
            { id: "C", text: "To convert the object into an HTTP cookie" },
            { id: "D", text: "It is required only if the database is PostgreSQL" }
          ],
          correctAnswer: "A",
          explanationNote: "Returning the created/modified object allows the client's selection set to query the new data (including server-generated IDs) in the same round trip."
        },
        retestMcq: {
          id: "q-8.2-1-v2",
          question: "When invoking a mutation from a client, can the client request specific fields on the returned object?",
          options: [
            { id: "A", text: "Yes, mutations can have selection sets just like queries" },
            { id: "B", text: "No, mutations can only return boolean status codes" },
            { id: "C", text: "No, mutations always return the entire raw database row" },
            { id: "D", text: "Only if the client sends an extra HTTP GET header" }
          ],
          correctAnswer: "A",
          explanationNote: "In GraphQL, any mutation returning an object type accepts a selection set specifying exactly which fields of the result to return."
        }
      },
      {
        heading: "GraphQL Enums",
        text: "Enums define a set of allowed constant values; in query documents, enum literals are written directly without quotation marks.",
        codeSnippet: `enum YesNo {\n  YES\n  NO\n}\ntype Query {\n  allPersons(phone: YesNo): [Person!]!\n}`,
        mcq: {
          id: "q-8.2-2-v1",
          question: "How are GraphQL enum values formatted when supplied in a GraphQL query document?",
          options: [
            { id: "A", text: "As unquoted identifiers, e.g. `allPersons(phone: YES)`" },
            { id: "B", text: "As double-quoted strings, e.g. `phone: \"YES\"`" },
            { id: "C", text: "As numbers, e.g. `phone: 1`" },
            { id: "D", text: "Prefixed with a colon, e.g. `phone: :YES`" }
          ],
          correctAnswer: "A",
          explanationNote: "In GraphQL SDL and query syntax, enum values are unquoted identifier tokens."
        },
        retestMcq: {
          id: "q-8.2-2-v2",
          question: "What happens if a client passes a value not defined in the Enum definition (e.g. `phone: MAYBE`)?",
          options: [
            { id: "A", text: "GraphQL validation fails before the resolver is executed and returns a schema validation error" },
            { id: "B", text: "The server silently coerces the value to null" },
            { id: "C", text: "The database table is automatically altered to include the new enum value" },
            { id: "D", text: "The server ignores the argument and executes without filtering" }
          ],
          correctAnswer: "A",
          explanationNote: "GraphQL validates inputs strictly against the schema before execution. Invalid enum values result in an immediate validation error."
        }
      },
      {
        heading: "Error Handling & GraphQLError",
        text: "Apollo Server provides `GraphQLError` to return structured errors with custom extension codes such as `BAD_USER_INPUT`.",
        codeSnippet: `import { GraphQLError } from 'graphql';\nif (args.name.length < 3) {\n  throw new GraphQLError('Name too short', {\n    extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.name }\n  });\n}`,
        mcq: {
          id: "q-8.2-3-v1",
          question: "What is the recommended class to throw custom GraphQL errors in modern Apollo Server?",
          options: [
            { id: "A", text: "GraphQLError from 'graphql'" },
            { id: "B", text: "Http500Exception from 'express'" },
            { id: "C", text: "SyntaxError from 'v8'" },
            { id: "D", text: "DOMException from 'window'" }
          ],
          correctAnswer: "A",
          explanationNote: "In Apollo Server v4+, throwing `GraphQLError` from the `graphql` package with an `extensions` object is the standard way to return structured errors."
        },
        retestMcq: {
          id: "q-8.2-3-v2",
          question: "When a GraphQL mutation throws a `GraphQLError`, what HTTP status code does Apollo Server usually return by default?",
          options: [
            { id: "A", text: "HTTP 200 OK with an `errors` array in the JSON response body" },
            { id: "B", text: "HTTP 500 Internal Server Error with empty body" },
            { id: "C", text: "HTTP 404 Not Found" },
            { id: "D", text: "HTTP 301 Moved Permanently" }
          ],
          correctAnswer: "A",
          explanationNote: "By standard GraphQL convention, execution errors are returned inside an `errors` array with an HTTP 200 OK status code."
        }
      },
      {
        heading: "Updating Entities with Mutations",
        text: "Update mutations identify the target record (e.g. by name or ID), modify specified fields, and return the modified record or null if not found.",
        codeSnippet: `editNumber: (root, args) => {\n  const person = persons.find(p => p.name === args.name);\n  if (!person) return null;\n  const updatedPerson = { ...person, phone: args.phone };\n  persons = persons.map(p => p.name === args.name ? updatedPerson : p);\n  return updatedPerson;\n}`,
        mcq: {
          id: "q-8.2-4-v1",
          question: "If a mutation definition is `editNumber(name: String!, phone: String!): Person`, what does returning `null` when a person isn't found indicate?",
          options: [
            { id: "A", text: "The person was not found, which is valid since `Person` is nullable (no exclamation mark)" },
            { id: "B", text: "The server will immediately crash with a null pointer exception" },
            { id: "C", text: "The schema will automatically create a new empty person" },
            { id: "D", text: "The database will delete the person table" }
          ],
          correctAnswer: "A",
          explanationNote: "Since `Person` does not have a `!`, it is nullable. Returning null is valid SDL and signals to the client that no entity was updated."
        },
        retestMcq: {
          id: "q-8.2-4-v2",
          question: "What would happen if `editNumber(...): Person!` returned `null` because the record wasn't found?",
          options: [
            { id: "A", text: "A GraphQL execution error is raised because a non-nullable field returned null" },
            { id: "B", text: "The server automatically substitutes an empty object `{}`" },
            { id: "C", text: "The client browser silently reloads the page" },
            { id: "D", text: "The mutation silently succeeds without returning anything" }
          ],
          correctAnswer: "A",
          explanationNote: "If a field is typed as non-nullable (`Person!`) and resolves to null, GraphQL generates a Cannot return null for non-nullable field error."
        }
      },
      {
        heading: "Custom Field Resolvers for Computed Data",
        text: "Individual fields on custom types can have their own resolver functions, allowing server-side computation or flattening of nested properties.",
        codeSnippet: `const resolvers = {\n  Person: {\n    address: (root) => ({ street: root.street, city: root.city })\n  }\n};`,
        mcq: {
          id: "q-8.2-5-v1",
          question: "In a field resolver `Person: { address: (root) => ... }`, what does the `root` parameter represent?",
          options: [
            { id: "A", text: "The parent Person object being resolved" },
            { id: "B", text: "The root express server instance" },
            { id: "C", text: "The MongoDB database connection string" },
            { id: "D", text: "The client's IP address" }
          ],
          correctAnswer: "A",
          explanationNote: "The first argument (`root` or `parent`) contains the result returned by the parent resolver, allowing child fields to extract nested data."
        },
        retestMcq: {
          id: "q-8.2-5-v2",
          question: "When are custom field resolvers on a type executed?",
          options: [
            { id: "A", text: "Only when the client query explicitly includes that specific field in its selection set" },
            { id: "B", text: "Always for every entity whenever the server boots up" },
            { id: "C", text: "Every 5 seconds in a background polling worker" },
            { id: "D", text: "Only when a mutation modifies that specific field" }
          ],
          correctAnswer: "A",
          explanationNote: "GraphQL resolvers are executed on demand: if a query omits a field from its selection set, that field's resolver function never runs."
        }
      }
    ]
  },
  {
    id: "8-3-apollo-client-react",
    number: "8.3",
    title: "Apollo Client & React Integration",
    subtitle: "Connect React applications to GraphQL servers using Apollo Client, ApolloProvider, and the useQuery hook.",
    readTime: "12 min",
    objectives: [
      "Set up ApolloClient with InMemoryCache and HttpLink",
      "Wrap React applications with ApolloProvider to provide GraphQL context",
      "Parse query documents into Abstract Syntax Trees using the gql tag",
      "Execute declarative queries in React components using the useQuery hook",
      "Handle loading, error, and data states cleanly in user interfaces",
      "Supply dynamic variables to useQuery operations"
    ],
    theoryBlocks: [
      {
        heading: "Apollo Client & InMemoryCache",
        text: "Apollo Client manages remote data fetching and normalizes GraphQL responses in a client-side `InMemoryCache` for instant re-renders.",
        codeSnippet: `import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';\nconst client = new ApolloClient({\n  uri: 'http://localhost:4000',\n  cache: new InMemoryCache()\n});`,
        mcq: {
          id: "q-8.3-0-v1",
          question: "What is the primary role of `InMemoryCache` in Apollo Client?",
          options: [
            { id: "A", text: "To store and normalize query results in memory to avoid duplicate network requests" },
            { id: "B", text: "To compile JSX into browser DOM nodes" },
            { id: "C", text: "To store user authentication passwords in plaintext" },
            { id: "D", text: "To compress images before sending them to the server" }
          ],
          correctAnswer: "A",
          explanationNote: "InMemoryCache normalizes incoming GraphQL responses by ID and stores them in memory, allowing instant reads and preventing duplicate fetches."
        },
        retestMcq: {
          id: "q-8.3-0-v2",
          question: "How does Apollo Client identify and normalize unique records in `InMemoryCache` by default?",
          options: [
            { id: "A", text: "By combining the object's `__typename` with its `id` or `_id` field" },
            { id: "B", text: "By using the client's current timestamp" },
            { id: "C", text: "By hashing the entire component file path" },
            { id: "D", text: "By saving records into the browser's localStorage" }
          ],
          correctAnswer: "A",
          explanationNote: "Apollo Client uses the pattern `__typename:id` to create unique cache keys for entities across all queries."
        }
      },
      {
        heading: "The ApolloProvider Component",
        text: "Similar to React's Context.Provider, `ApolloProvider` wraps the application root and places the Apollo Client on the React context.",
        codeSnippet: `ReactDOM.createRoot(document.getElementById('root')).render(\n  <ApolloProvider client={client}>\n    <App />\n  </ApolloProvider>\n);`,
        mcq: {
          id: "q-8.3-1-v1",
          question: "Where should `<ApolloProvider client={client}>` typically be placed in a React project?",
          options: [
            { id: "A", text: "Wrapping the root component tree (e.g. in index.js or main.jsx)" },
            { id: "B", text: "Inside individual leaf button components" },
            { id: "C", text: "Inside an async useEffect hook" },
            { id: "D", text: "In the public/index.html head element" }
          ],
          correctAnswer: "A",
          explanationNote: "ApolloProvider wraps the top-level React component tree so that all child components can access hooks like `useQuery` and `useMutation`."
        },
        retestMcq: {
          id: "q-8.3-1-v2",
          question: "What error occurs if you call `useQuery` inside a component that is NOT wrapped by an `ApolloProvider`?",
          options: [
            { id: "A", text: "An invariant error stating that could not find client in the context of ApolloProvider" },
            { id: "B", text: "The browser tab immediately freezes" },
            { id: "C", text: "The query executes via jQuery AJAX instead" },
            { id: "D", text: "It silently returns empty mock data" }
          ],
          correctAnswer: "A",
          explanationNote: "Calling Apollo hooks outside ApolloProvider throws an error because the React context containing the client instance is undefined."
        }
      },
      {
        heading: "Declaring Queries with gql Template Tag",
        text: "The `gql` template literal tag parses GraphQL query strings into an Abstract Syntax Tree (AST) that Apollo Client can execute.",
        codeSnippet: `const ALL_PERSONS = gql\`\n  query {\n    allPersons {\n      name\n      phone\n      id\n    }\n  }\n\`;`,
        mcq: {
          id: "q-8.3-2-v1",
          question: "Why do we wrap GraphQL query strings with the `gql` template tag in JavaScript?",
          options: [
            { id: "A", text: "To parse the GraphQL string into a structured AST document that Apollo Client understands" },
            { id: "B", text: "To compile the query into native C++ binaries" },
            { id: "C", text: "To encrypt the query string with SSL before transmission" },
            { id: "D", text: "To convert GraphQL into an SQL statement" }
          ],
          correctAnswer: "A",
          explanationNote: "`gql` parses the GraphQL query string into an Abstract Syntax Tree (AST) document object, enabling syntax highlighting, linting, and Apollo execution."
        },
        retestMcq: {
          id: "q-8.3-2-v2",
          question: "Why is it best practice to include the `id` field in every GraphQL selection set when using Apollo Client?",
          options: [
            { id: "A", text: "It enables Apollo's InMemoryCache to normalize, identify, and automatically update individual objects" },
            { id: "B", text: "Without `id`, Apollo Server refuses to send the HTTP response" },
            { id: "C", text: "The browser will not render HTML without an `id` field" },
            { id: "D", text: "It generates a CSS class name for React elements" }
          ],
          correctAnswer: "A",
          explanationNote: "Including `id` (or `_id`) allows Apollo's InMemoryCache to uniquely identify entities and automatically re-render components when those entities mutate."
        }
      },
      {
        heading: "The useQuery Hook & States",
        text: "The `useQuery` hook automatically runs a query when the component mounts and returns `{ data, loading, error }` states.",
        codeSnippet: `const { loading, error, data } = useQuery(ALL_PERSONS);\nif (loading) return <div>loading...</div>;\nif (error) return <div>Error: {error.message}</div>;\nreturn <ul>{data.allPersons.map(p => <li key={p.id}>{p.name}</li>)}</ul>;`,
        mcq: {
          id: "q-8.3-3-v1",
          question: "What does `useQuery(ALL_PERSONS)` return while the network request is still pending?",
          options: [
            { id: "A", text: "`loading: true` and `data: undefined`" },
            { id: "B", text: "`loading: false` and `data: null`" },
            { id: "C", text: "It pauses component rendering with a synchronous blocking while loop" },
            { id: "D", text: "`error: true`" }
          ],
          correctAnswer: "A",
          explanationNote: "While fetching, `useQuery` sets `loading: true` and `data: undefined`. UI components check `loading` to display spinners or skeleton screens."
        },
        retestMcq: {
          id: "q-8.3-3-v2",
          question: "If a GraphQL server returns an execution error, how does `useQuery` expose that error to the component?",
          options: [
            { id: "A", text: "Via the `error` property on the returned result object (an ApolloError instance)" },
            { id: "B", text: "It crashes the entire React application with an uncatchable exception" },
            { id: "C", text: "It writes the error into window.alert automatically" },
            { id: "D", text: "It sets `data: false`" }
          ],
          correctAnswer: "A",
          explanationNote: "`useQuery` captures GraphQL errors and network failures in an `error` property containing an `ApolloError` object."
        }
      },
      {
        heading: "Queries with Dynamic Variables",
        text: "Parameters in queries are parameterized with `$` symbols in SDL and passed via the `variables` property in `useQuery` options.",
        codeSnippet: `const FIND_PERSON = gql\`\n  query findPersonByName($nameToSearch: String!) {\n    findPerson(name: $nameToSearch) {\n      name phone id\n    }\n  }\n\`;\nconst { data } = useQuery(FIND_PERSON, { variables: { nameToSearch: 'Arto Hellas' } });`,
        mcq: {
          id: "q-8.3-4-v1",
          question: "How are dynamic parameters passed into a GraphQL query using the `useQuery` hook?",
          options: [
            { id: "A", text: "Via the `variables` key in the options object passed as the second argument to `useQuery`" },
            { id: "B", text: "By string concatenation into the `gql` template string" },
            { id: "C", text: "Through an HTML form hidden input" },
            { id: "D", text: "By assigning them to `process.env`" }
          ],
          correctAnswer: "A",
          explanationNote: "Variables are defined with `$` in GraphQL documents and supplied cleanly via `{ variables: { ... } }` in the hook options."
        },
        retestMcq: {
          id: "q-8.3-4-v2",
          question: "What is the security and performance benefit of using GraphQL query variables rather than string concatenation?",
          options: [
            { id: "A", text: "It allows query documents to be cached and statically analyzed while preventing injection attacks" },
            { id: "B", text: "It automatically translates strings into foreign languages" },
            { id: "C", text: "It bypasses all browser CORS restrictions" },
            { id: "D", text: "It compresses the payload to 1 byte" }
          ],
          correctAnswer: "A",
          explanationNote: "Using variables preserves the static structure of the query document for AST caching and prevents query injection attacks."
        }
      },
      {
        heading: "Conditional Query Execution with skip",
        text: "The `skip` option allows components to prevent `useQuery` from executing until a necessary variable is defined or a condition is met.",
        codeSnippet: `const { data } = useQuery(FIND_PERSON, {\n  variables: { nameToSearch },\n  skip: !nameToSearch\n});`,
        mcq: {
          id: "q-8.3-5-v1",
          question: "What does the `skip: !nameToSearch` option do in `useQuery`?",
          options: [
            { id: "A", text: "It skips executing the query over the network until `nameToSearch` has a truthy value" },
            { id: "B", text: "It deletes the query from the Apollo cache permanently" },
            { id: "C", text: "It skips the first item in the returned array" },
            { id: "D", text: "It forces the query to use HTTP GET instead of POST" }
          ],
          correctAnswer: "A",
          explanationNote: "When `skip: true`, `useQuery` pauses network execution and returns `loading: false` with `data: undefined` until the condition becomes false."
        },
        retestMcq: {
          id: "q-8.3-5-v2",
          question: "If you need to execute a query manually in response to a user action (like a button click) rather than on mount, what hook should you use?",
          options: [
            { id: "A", text: "`useLazyQuery`" },
            { id: "B", text: "`useMemo`" },
            { id: "C", text: "`useDeferredQuery`" },
            { id: "D", text: "`useManualFetch`" }
          ],
          correctAnswer: "A",
          explanationNote: "`useLazyQuery` returns an execution function that can be called imperatively in response to user events such as button clicks."
        }
      }
    ]
  },
  {
    id: "8-4-apollo-mutations-cache",
    number: "8.4",
    title: "Apollo Client Mutations & Cache Management",
    subtitle: "Execute server mutations, synchronize cache state with refetchQueries, and optimize performance with direct cache updates.",
    readTime: "12 min",
    objectives: [
      "Define and call mutation operations using the useMutation hook",
      "Pass form inputs and parameters into mutation executions via variables",
      "Keep query views updated using refetchQueries options",
      "Update the Apollo InMemoryCache directly with updateQuery and cache.modify",
      "Implement optimistic UI updates for instantaneous user interface response",
      "Handle server-side validation and network errors with onError callbacks"
    ],
    theoryBlocks: [
      {
        heading: "The useMutation Hook Basics",
        text: "The `useMutation` hook returns a tuple containing a mutate trigger function and a mutation result object `{ data, loading, error }`.",
        codeSnippet: `const CREATE_PERSON = gql\`\n  mutation createPerson($name: String!, $phone: String, $street: String!, $city: String!) {\n    addPerson(name: $name, phone: $phone, street: $street, city: $city) {\n      name phone id\n    }\n  }\n\`;\nconst [ createPerson, result ] = useMutation(CREATE_PERSON);`,
        mcq: {
          id: "q-8.4-0-v1",
          question: "Unlike `useQuery` which runs automatically on component render, when does the mutation defined by `useMutation` execute?",
          options: [
            { id: "A", text: "Only when the mutate trigger function returned in the tuple is explicitly invoked" },
            { id: "B", text: "Automatically whenever the browser window is resized" },
            { id: "C", text: "Every 60 seconds on an interval" },
            { id: "D", text: "As soon as the JavaScript file is parsed by Node.js" }
          ],
          correctAnswer: "A",
          explanationNote: "`useMutation` does not execute immediately. It returns a trigger function (first element in the tuple) that you call when desired (e.g., in a form submit handler)."
        },
        retestMcq: {
          id: "q-8.4-0-v2",
          question: "How do you pass variables to a mutation trigger function when handling a form submission?",
          options: [
            { id: "A", text: "`createPerson({ variables: { name, phone, street, city } })`" },
            { id: "B", text: "`createPerson(name, phone, street, city)`" },
            { id: "C", text: "`createPerson.post({ name, phone })`" },
            { id: "D", text: "`createPerson.sendFormData()`" }
          ],
          correctAnswer: "A",
          explanationNote: "The mutate function accepts an options object containing a `variables` key matching the parameterized GraphQL mutation variables."
        }
      },
      {
        heading: "Refetching Queries with refetchQueries",
        text: "Supplying `refetchQueries` to `useMutation` instructs Apollo Client to automatically re-execute specified queries after a mutation completes.",
        codeSnippet: `const [ createPerson ] = useMutation(CREATE_PERSON, {\n  refetchQueries: [ { query: ALL_PERSONS } ]\n});`,
        mcq: {
          id: "q-8.4-1-v1",
          question: "What is the purpose of the `refetchQueries` option in `useMutation`?",
          options: [
            { id: "A", text: "To automatically re-fetch specified queries to refresh UI components showing updated lists" },
            { id: "B", text: "To retry the mutation if the internet connection drops" },
            { id: "C", text: "To refresh the browser page with window.location.reload()" },
            { id: "D", text: "To delete the queries from the Apollo Client bundle" }
          ],
          correctAnswer: "A",
          explanationNote: "`refetchQueries` ensures that any active queries displaying data impacted by the mutation are re-run, keeping the UI up-to-date."
        },
        retestMcq: {
          id: "q-8.4-1-v2",
          question: "What is a potential performance downside of using `refetchQueries` heavily for large datasets?",
          options: [
            { id: "A", text: "It triggers an extra network round-trip to re-fetch the entire query dataset" },
            { id: "B", text: "It invalidates all browser cookies" },
            { id: "C", text: "It forces the GraphQL server to restart" },
            { id: "D", text: "It changes the database schema dynamically" }
          ],
          correctAnswer: "A",
          explanationNote: "`refetchQueries` issues fresh HTTP requests for each listed query, which can increase network traffic compared to updating the cache directly."
        }
      },
      {
        heading: "Direct Cache Updates with update Callback",
        text: "The `update` callback provides direct access to the cache, allowing you to insert the mutation's response into active query results without extra network requests.",
        codeSnippet: `const [ createPerson ] = useMutation(CREATE_PERSON, {\n  update: (cache, response) => {\n    cache.updateQuery({ query: ALL_PERSONS }, ({ allPersons }) => {\n      return { allPersons: allPersons.concat(response.data.addPerson) };\n    });\n  }\n});`,
        mcq: {
          id: "q-8.4-2-v1",
          question: "What is the primary advantage of using the `update` callback instead of `refetchQueries`?",
          options: [
            { id: "A", text: "It updates the local cache immediately without making additional network round-trips" },
            { id: "B", text: "It bypasses GraphQL validation on the server" },
            { id: "C", text: "It writes the data directly to disk storage" },
            { id: "D", text: "It eliminates the need for React state hooks" }
          ],
          correctAnswer: "A",
          explanationNote: "Using the `update` callback modifies the Apollo Client `InMemoryCache` synchronously in memory using the mutation's return value, saving an HTTP round-trip."
        },
        retestMcq: {
          id: "q-8.4-2-v2",
          question: "In the `update: (cache, response) => { ... }` callback, what does `response.data` contain?",
          options: [
            { id: "A", text: "The payload returned by the executed mutation as defined by its selection set" },
            { id: "B", text: "The raw HTTP headers sent by the proxy server" },
            { id: "C", text: "The client's localStorage items" },
            { id: "D", text: "The entire backend database snapshot" }
          ],
          correctAnswer: "A",
          explanationNote: "`response.data` contains the data returned by the mutation, allowing you to append or merge it directly into cached query datasets."
        }
      },
      {
        heading: "Optimistic UI Responses",
        text: "With `optimisticResponse`, Apollo Client updates the UI instantly using an assumed response before the server confirms the mutation.",
        codeSnippet: `createPerson({\n  variables: { name, phone },\n  optimisticResponse: {\n    addPerson: { __typename: 'Person', id: 'temp-id', name, phone }\n  }\n});`,
        mcq: {
          id: "q-8.4-3-v1",
          question: "What is an optimistic response in Apollo Client?",
          options: [
            { id: "A", text: "A temporary simulated response written to the cache before the server responds, providing instant UI feedback" },
            { id: "B", text: "A response that ignores all server validation errors" },
            { id: "C", text: "A query that only fetches positive numerical values" },
            { id: "D", text: "A promise that never rejects" }
          ],
          correctAnswer: "A",
          explanationNote: "Optimistic UI immediately renders the expected result; once the server responds, Apollo replaces the optimistic data with the real server response."
        },
        retestMcq: {
          id: "q-8.4-3-v2",
          question: "What happens if a mutation with an `optimisticResponse` fails on the server with a network error?",
          options: [
            { id: "A", text: "Apollo Client automatically rolls back the optimistic changes from the cache" },
            { id: "B", text: "The invalid optimistic data remains stuck in the cache forever" },
            { id: "C", text: "The browser reloads the webpage immediately" },
            { id: "D", text: "The server retries the mutation in an infinite loop" }
          ],
          correctAnswer: "A",
          explanationNote: "If the mutation fails, Apollo Client rolls back the optimistic cache mutation, reverting the UI to its prior correct state."
        }
      },
      {
        heading: "Handling Mutation Errors with onError",
        text: "The `onError` option handles errors gracefully on the client without throwing unhandled promise rejections in the UI code.",
        codeSnippet: `const [ createPerson ] = useMutation(CREATE_PERSON, {\n  onError: (error) => {\n    const messages = error.graphQLErrors.map(e => e.message).join('\\n');\n    notify(messages);\n  }\n});`,
        mcq: {
          id: "q-8.4-4-v1",
          question: "Where can you access specific validation error messages returned by a GraphQL server in Apollo Client's `error` object?",
          options: [
            { id: "A", text: "`error.graphQLErrors` (an array of individual GraphQL error items)" },
            { id: "B", text: "`window.errorHistory`" },
            { id: "C", text: "`document.title`" },
            { id: "D", text: "`error.body.toString()`" }
          ],
          correctAnswer: "A",
          explanationNote: "`ApolloError` exposes `graphQLErrors` (errors returned from GraphQL execution) and `networkError` (HTTP/network failures)."
        },
        retestMcq: {
          id: "q-8.4-4-v2",
          question: "Why is using `onError` in `useMutation` options often preferable to `try { await mutate() } catch`?",
          options: [
            { id: "A", text: "It cleanly centralizes error notification logic and avoids unhandled promise rejection warnings in component handlers" },
            { id: "B", text: "It prevents any HTTP 500 status codes on the server" },
            { id: "C", text: "It converts errors into warning logs only" },
            { id: "D", text: "It allows React components to bypass JSX rendering" }
          ],
          correctAnswer: "A",
          explanationNote: "Defining `onError` in `useMutation` ensures errors are cleanly intercepted and handled for that mutation across all invocations."
        }
      },
      {
        heading: "Automatic Cache Updates for Single Entities",
        text: "When a mutation updates an existing entity and returns its `id`, Apollo Client automatically updates that entity everywhere in the cache without manual `update` code.",
        codeSnippet: `// If EDIT_NUMBER returns { id: "123", phone: "040-999" },\n// Person:123 is automatically updated across all components!\nconst [ editNumber ] = useMutation(EDIT_NUMBER);`,
        mcq: {
          id: "q-8.4-5-v1",
          question: "When does Apollo Client automatically update an entity in all active views without requiring `refetchQueries` or an `update` callback?",
          options: [
            { id: "A", text: "When the mutation returns the modified entity with the same `id` and `__typename` already present in the cache" },
            { id: "B", text: "Only when the entity contains fewer than 3 properties" },
            { id: "C", text: "Only when using GraphQL Subscriptions" },
            { id: "D", text: "Whenever the user clicks a submit button" }
          ],
          correctAnswer: "A",
          explanationNote: "Because Apollo normalizes entities by `__typename:id`, returning an existing entity's `id` with updated fields updates the cache automatically."
        },
        retestMcq: {
          id: "q-8.4-5-v2",
          question: "Why DOES an item creation mutation (e.g. `addPerson`) require `update` or `refetchQueries`, unlike an update mutation?",
          options: [
            { id: "A", text: "Because Apollo does not know which active list queries (e.g. `allPersons`) the newly created entity belongs to" },
            { id: "B", text: "Because new items cannot have IDs assigned" },
            { id: "C", text: "Because the cache only stores existing objects" },
            { id: "D", text: "Because creation mutations always return null" }
          ],
          correctAnswer: "A",
          explanationNote: "An updated object already exists in the cache by its ID. A newly created object must be explicitly attached to any cached array lists."
        }
      }
    ]
  },
  {
    id: "8-5-database-and-auth",
    number: "8.5",
    title: "Database Integration, User Auth & N+1 Problem",
    subtitle: "Persist GraphQL models in MongoDB, secure resolvers with JWT context authentication, and optimize queries with DataLoader.",
    readTime: "12 min",
    objectives: [
      "Integrate Mongoose database models inside Apollo Server resolver operations",
      "Manage user accounts, password hashing, and login mutations returning JWT tokens",
      "Attach authenticated user objects to the Apollo Server context parameter",
      "Enforce authorization rules in resolvers using context.currentUser",
      "Diagnose the classic GraphQL N+1 database queries problem",
      "Batch and cache database reads across nested resolvers using DataLoader"
    ],
    theoryBlocks: [
      {
        heading: "Connecting Resolvers to Mongoose Models",
        text: "Resolvers can interact directly with Mongoose models; async resolver functions await database operations before returning documents.",
        codeSnippet: `const resolvers = {\n  Query: {\n    allPersons: async () => await Person.find({}),\n    personCount: async () => await Person.collection.countDocuments()\n  }\n};`,
        mcq: {
          id: "q-8.5-0-v1",
          question: "Can GraphQL resolver functions be declared as `async` in JavaScript?",
          options: [
            { id: "A", text: "Yes, Apollo Server automatically awaits returned Promises before constructing the response" },
            { id: "B", text: "No, all resolvers must be strictly synchronous functions" },
            { id: "C", text: "Only mutation resolvers can be async; queries must be synchronous" },
            { id: "D", text: "Only if connected to a relational SQL database" }
          ],
          correctAnswer: "A",
          explanationNote: "GraphQL execution engines seamlessly resolve Promises returned by resolvers before sending the final serialized JSON response."
        },
        retestMcq: {
          id: "q-8.5-0-v2",
          question: "When a Mongoose document has an `_id` field (an ObjectId), how does GraphQL resolve the schema field `id: ID!`?",
          options: [
            { id: "A", text: "Mongoose provides a virtual `id` getter that serializes `_id` to a string matching the GraphQL schema" },
            { id: "B", text: "You must manually rename `_id` to `id` in every single resolver" },
            { id: "C", text: "GraphQL converts all ObjectIds to floating-point numbers" },
            { id: "D", text: "It throws a SchemaTypeMismatch error" }
          ],
          correctAnswer: "A",
          explanationNote: "Mongoose models automatically include a virtual `id` property that returns the string representation of `_id`, satisfying GraphQL `id: ID!`."
        }
      },
      {
        heading: "Authentication via Apollo Context",
        text: "The Apollo Server `context` function extracts the `Authorization: Bearer <token>` header on each request, decodes the JWT, and attaches the user.",
        codeSnippet: `const { url } = await startStandaloneServer(server, {\n  context: async ({ req }) => {\n    const auth = req ? req.headers.authorization : null;\n    if (auth && auth.startsWith('Bearer ')) {\n      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET);\n      const currentUser = await User.findById(decodedToken.id);\n      return { currentUser };\n    }\n  }\n});`,
        mcq: {
          id: "q-8.5-1-v1",
          question: "How is the authenticated user made accessible to all resolver functions in Apollo Server?",
          options: [
            { id: "A", text: "By attaching `currentUser` inside the server's `context` callback function" },
            { id: "B", text: "By storing the user in a global window variable" },
            { id: "C", text: "By appending the user credentials to every GraphQL query string" },
            { id: "D", text: "By saving the user in an environment variable `process.env.USER`" }
          ],
          correctAnswer: "A",
          explanationNote: "The object returned by the `context` function is passed as the 3rd argument `(root, args, context)` to every resolver in the request."
        },
        retestMcq: {
          id: "q-8.5-1-v2",
          question: "What parameter in a resolver function `(root, args, context, info)` provides access to the authenticated user?",
          options: [
            { id: "A", text: "The third parameter `context`" },
            { id: "B", text: "The first parameter `root`" },
            { id: "C", text: "The second parameter `args`" },
            { id: "D", text: "The fourth parameter `info`" }
          ],
          correctAnswer: "A",
          explanationNote: "The 3rd argument to any resolver is `context`, containing shared per-request objects such as `currentUser` and data loaders."
        }
      },
      {
        heading: "Enforcing Authorization in Resolvers",
        text: "Resolvers check `context.currentUser` to verify authentication; unauthenticated requests throw a `GraphQLError` with code `UNAUTHENTICATED`.",
        codeSnippet: `addPerson: async (root, args, context) => {\n  const currentUser = context.currentUser;\n  if (!currentUser) {\n    throw new GraphQLError('not authenticated', {\n      extensions: { code: 'BAD_USER_INPUT' }\n    });\n  }\n  // proceed with creating person linked to currentUser\n}`,
        mcq: {
          id: "q-8.5-2-v1",
          question: "How should a resolver guard against unauthorized access when creating or modifying records?",
          options: [
            { id: "A", text: "By inspecting `context.currentUser` and throwing a `GraphQLError` if it is null or undefined" },
            { id: "B", text: "By prompting the user with `window.confirm`" },
            { id: "C", text: "By returning an empty array `[]`" },
            { id: "D", text: "By terminating the Node.js server process" }
          ],
          correctAnswer: "A",
          explanationNote: "Resolvers verify that `context.currentUser` exists; if not, throwing an authentication error halts execution safely."
        },
        retestMcq: {
          id: "q-8.5-2-v2",
          question: "Where in a full stack architecture is authorization logic primarily enforced in GraphQL applications?",
          options: [
            { id: "A", text: "On the server side within resolver functions and business logic layers" },
            { id: "B", text: "Solely on the client by hiding buttons in React" },
            { id: "C", text: "In browser CSS display:none rules" },
            { id: "D", text: "Inside the HTML head tag" }
          ],
          correctAnswer: "A",
          explanationNote: "While UI components can hide actions, server resolvers must strictly validate authorization because clients can send arbitrary GraphQL queries directly."
        }
      },
      {
        heading: "Setting the Authorization Header in Apollo Client",
        text: "Using `setContext` from `@apollo/client/link/context`, Apollo Client automatically attaches the saved JWT token to the HTTP `Authorization` header.",
        codeSnippet: `import { setContext } from '@apollo/client/link/context';\nconst authLink = setContext((_, { headers }) => {\n  const token = localStorage.getItem('phonenumbers-user-token');\n  return {\n    headers: { ...headers, authorization: token ? \`Bearer \${token}\` : null }\n  };\n});\nconst client = new ApolloClient({\n  link: authLink.concat(httpLink),\n  cache: new InMemoryCache()\n});`,
        mcq: {
          id: "q-8.5-3-v1",
          question: "What utility from Apollo Client allows modifying outgoing HTTP request headers to attach a stored JWT Bearer token?",
          options: [
            { id: "A", text: "`setContext` from `@apollo/client/link/context`" },
            { id: "B", text: "`fetchHeaderLink` from `react`" },
            { id: "C", text: "`localStorage.sendHeader()`" },
            { id: "D", text: "`express.headerMiddleware`" }
          ],
          correctAnswer: "A",
          explanationNote: "`setContext` creates an Apollo Link that intercepts outgoing GraphQL operations and appends custom headers like `authorization`."
        },
        retestMcq: {
          id: "q-8.5-3-v2",
          question: "How does `authLink.concat(httpLink)` configure the request pipeline in Apollo Client?",
          options: [
            { id: "A", text: "It chains the links so `authLink` injects headers before `httpLink` sends the HTTP request" },
            { id: "B", text: "It combines two separate GraphQL databases into one" },
            { id: "C", text: "It alternates requests between two servers for load balancing" },
            { id: "D", text: "It converts HTTP POST requests to WebSockets" }
          ],
          correctAnswer: "A",
          explanationNote: "Apollo Links form a middleware chain: `authLink` sets the headers first, then passes the modified request to `httpLink` for network dispatch."
        }
      },
      {
        heading: "The N+1 Database Query Problem",
        text: "When querying a list of items with nested related fields, a naive resolver fires 1 initial query plus N additional queries for each child item.",
        codeSnippet: `// 1 query for allBooks (returns 100 books)\n// + 100 separate queries for each book's author!\nAuthor: {\n  bookCount: async (root) => await Book.countDocuments({ author: root.id })\n}`,
        mcq: {
          id: "q-8.5-4-v1",
          question: "What is the 'N+1 problem' in GraphQL servers?",
          options: [
            { id: "A", text: "Fetching a list of N items causes 1 query for the parent list plus N separate queries for each child's nested field" },
            { id: "B", text: "A bug where array indices start at 1 instead of 0" },
            { id: "C", text: "Having more than N servers running concurrently" },
            { id: "D", text: "A memory leak caused by N+1 open browser tabs" }
          ],
          correctAnswer: "A",
          explanationNote: "The N+1 problem occurs when a list of N items triggers an individual database lookup for each element in nested resolvers, severely degrading database performance."
        },
        retestMcq: {
          id: "q-8.5-4-v2",
          question: "If a query fetches 50 authors and each author resolves their books via a separate query, how many database queries are issued in an N+1 scenario?",
          options: [
            { id: "A", text: "51 queries (1 for authors + 50 for books)" },
            { id: "B", text: "1 query" },
            { id: "C", text: "2 queries" },
            { id: "D", text: "2500 queries" }
          ],
          correctAnswer: "A",
          explanationNote: "1 query retrieves the 50 authors, and then 50 individual queries retrieve each author's books, totaling 51 queries."
        }
      },
      {
        heading: "Solving N+1 with DataLoader",
        text: "DataLoader batches multiple individual requests made across a single tick of the event loop and loads them in a single batch database query.",
        codeSnippet: `import DataLoader from 'dataloader';\nconst authorBookCountLoader = new DataLoader(async (authorIds) => {\n  const books = await Book.find({ author: { $in: authorIds } });\n  return authorIds.map(id => books.filter(b => b.author.toString() === id.toString()).length);\n});`,
        mcq: {
          id: "q-8.5-5-v1",
          question: "How does DataLoader solve the GraphQL N+1 query problem?",
          options: [
            { id: "A", text: "By batching individual keys collected in one tick into a single `$in` query and caching the results" },
            { id: "B", text: "By disabling nested fields in GraphQL queries" },
            { id: "C", text: "By pre-loading the entire database into browser memory" },
            { id: "D", text: "By converting GraphQL to static HTML files" }
          ],
          correctAnswer: "A",
          explanationNote: "DataLoader coalesces individual `load(key)` calls within an event loop tick into a single batch function call, replacing N queries with 1 batched query."
        },
        retestMcq: {
          id: "q-8.5-5-v2",
          question: "Why should a new instance of DataLoader typically be created per request inside the Apollo `context` function?",
          options: [
            { id: "A", text: "To prevent cross-request memory caching and data leakage between different users" },
            { id: "B", text: "Because DataLoader can only execute once before self-destructing" },
            { id: "C", text: "To allow DataLoader to write to disk" },
            { id: "D", text: "Because Node.js does not allow singleton classes" }
          ],
          correctAnswer: "A",
          explanationNote: "Creating DataLoader instances per request ensures that its in-memory cache is scoped only to that specific request, avoiding stale or unauthorized cross-user data leakage."
        }
      }
    ]
  },
  {
    id: "8-6-subscriptions-realtime",
    number: "8.6",
    title: "Subscriptions & Real-Time WebSockets",
    subtitle: "Stream live server events to React applications using GraphQL Subscriptions, WebSockets, and Apollo Client split links.",
    readTime: "12 min",
    objectives: [
      "Define live event streams using the root Subscription type in SDL",
      "Publish real-time events using graphql-subscriptions and PubSub engines",
      "Configure WebSocket transport on Apollo Server using graphql-ws",
      "Set up Apollo Client split links to route HTTP and WebSocket traffic",
      "Listen for real-time broadcasts in React with the useSubscription hook",
      "Update the client-side cache automatically upon receiving subscription messages"
    ],
    theoryBlocks: [
      {
        heading: "GraphQL Subscriptions Concept",
        text: "Subscriptions maintain a persistent bidirectional connection (typically WebSockets) enabling the server to push real-time updates to subscribed clients.",
        codeSnippet: `type Subscription {\n  personAdded: Person!\n}`,
        mcq: {
          id: "q-8.6-0-v1",
          question: "How do GraphQL Subscriptions fundamentally differ from Queries and Mutations?",
          options: [
            { id: "A", text: "They maintain an open connection so the server pushes events to the client over time" },
            { id: "B", text: "They run exclusively inside web workers without internet access" },
            { id: "C", text: "They only work with relational SQL databases" },
            { id: "D", text: "They can only be called from mobile applications" }
          ],
          correctAnswer: "A",
          explanationNote: "Unlike one-off request-response cycles, Subscriptions establish persistent connections (via WebSockets) where the server streams updates when events occur."
        },
        retestMcq: {
          id: "q-8.6-0-v2",
          question: "Which transport protocol is most commonly used by GraphQL Subscriptions for persistent streaming?",
          options: [
            { id: "A", text: "WebSockets (ws:// / wss://)" },
            { id: "B", text: "FTP" },
            { id: "C", text: "SMTP" },
            { id: "D", text: "DNS" }
          ],
          correctAnswer: "A",
          explanationNote: "GraphQL Subscriptions typically communicate over WebSockets, allowing bidirectional, low-latency, persistent event streams."
        }
      },
      {
        heading: "PubSub Event Publishing",
        text: "A `PubSub` engine acts as an event bus: resolvers publish events to topic strings, and subscription resolvers listen using `subscribe`.",
        codeSnippet: `import { PubSub } from 'graphql-subscriptions';\nconst pubsub = new PubSub();\n// Inside Mutation:\npubsub.publish('PERSON_ADDED', { personAdded: newPerson });\n// Inside Subscription:\nSubscription: {\n  personAdded: { subscribe: () => pubsub.asyncIterator('PERSON_ADDED') }\n}`,
        mcq: {
          id: "q-8.6-1-v1",
          question: "In `pubsub.publish('PERSON_ADDED', { personAdded: newPerson })`, what does the second argument represent?",
          options: [
            { id: "A", text: "The payload object whose key matches the subscription field name" },
            { id: "B", text: "The client's WebSocket connection token" },
            { id: "C", text: "The database password" },
            { id: "D", text: "The HTTP status code" }
          ],
          correctAnswer: "A",
          explanationNote: "The publish payload object must have a property matching the subscription field (`personAdded`) so the subscription resolver can return it to subscribers."
        },
        retestMcq: {
          id: "q-8.6-1-v2",
          question: "What does `pubsub.asyncIterator(['PERSON_ADDED'])` return to the GraphQL subscription engine?",
          options: [
            { id: "A", text: "An AsyncIterator that yields values each time an event is published to that topic" },
            { id: "B", text: "A static JavaScript array of past events" },
            { id: "C", text: "A synchronous while loop" },
            { id: "D", text: "An HTTP redirect response" }
          ],
          correctAnswer: "A",
          explanationNote: "`asyncIterator` returns an asynchronous iterator that notifies the GraphQL server whenever new data is published on the specified channel."
        }
      },
      {
        heading: "Server WebSocket Setup with graphql-ws",
        text: "Modern Apollo Servers combine HTTP with WebSockets using `makeExecutableSchema`, `WebSocketServer`, and the `useServer` hook from `graphql-ws`.",
        codeSnippet: `import { WebSocketServer } from 'ws';\nimport { useServer } from 'graphql-ws/lib/use/ws';\nconst wsServer = new WebSocketServer({ server: httpServer, path: '/' });\nconst serverCleanup = useServer({ schema }, wsServer);`,
        mcq: {
          id: "q-8.6-2-v1",
          question: "Which modern protocol library has replaced legacy `subscriptions-transport-ws` in Apollo Server v4?",
          options: [
            { id: "A", text: "`graphql-ws`" },
            { id: "B", text: "`socket.io-v1`" },
            { id: "C", text: "`actioncable`" },
            { id: "D", text: "`browser-ws-polyfill`" }
          ],
          correctAnswer: "A",
          explanationNote: "`graphql-ws` is the actively maintained, standard protocol library recommended for WebSocket GraphQL subscriptions in modern Apollo Server."
        },
        retestMcq: {
          id: "q-8.6-2-v2",
          question: "Why must `makeExecutableSchema({ typeDefs, resolvers })` be created explicitly when setting up WebSockets on Apollo Server?",
          options: [
            { id: "A", text: "Both the HTTP ApolloServer and the WebSocket useServer must share the exact same compiled schema instance" },
            { id: "B", text: "Because WebSockets cannot parse string schemas" },
            { id: "C", text: "To encrypt the GraphQL schema with TLS" },
            { id: "D", text: "To prevent the server from using Node.js" }
          ],
          correctAnswer: "A",
          explanationNote: "Both the HTTP server and the WebSocket server need to execute operations against the same schema, so `makeExecutableSchema` creates a single shared schema object."
        }
      },
      {
        heading: "Apollo Client Split Link",
        text: "The `split` function inspects operations, routing queries and mutations to an `HttpLink` while directing subscriptions to a `GraphQLWsLink`.",
        codeSnippet: `import { split, HttpLink } from '@apollo/client';\nimport { getMainDefinition } from '@apollo/client/utilities';\nimport { GraphQLWsLink } from '@apollo/client/link/subscriptions';\nimport { createClient } from 'graphql-ws';\nconst splitLink = split(\n  ({ query }) => {\n    const def = getMainDefinition(query);\n    return def.kind === 'OperationDefinition' && def.operation === 'subscription';\n  },\n  wsLink,\n  httpLink\n);`,
        mcq: {
          id: "q-8.6-3-v1",
          question: "What is the purpose of Apollo Client's `split` function when configuring communication links?",
          options: [
            { id: "A", text: "To route subscription operations to a WebSocket link and query/mutation operations to an HTTP link" },
            { id: "B", text: "To split string responses into arrays" },
            { id: "C", text: "To divide network packets across multiple Wi-Fi networks" },
            { id: "D", text: "To split the React tree into multiple browser windows" }
          ],
          correctAnswer: "A",
          explanationNote: "`split` acts as a traffic router: if the predicate returns true (it's a subscription), it sends it over WebSockets; otherwise, over HTTP."
        },
        retestMcq: {
          id: "q-8.6-3-v2",
          question: "What function from `@apollo/client/utilities` inspects the AST to determine if an operation is a subscription?",
          options: [
            { id: "A", text: "`getMainDefinition`" },
            { id: "B", text: "`parseQueryKind`" },
            { id: "C", text: "`getOperationKind`" },
            { id: "D", text: "`extractAstType`" }
          ],
          correctAnswer: "A",
          explanationNote: "`getMainDefinition(query)` inspects the root AST node to check if `def.operation === 'subscription'`."
        }
      },
      {
        heading: "The useSubscription Hook in React",
        text: "The `useSubscription` hook connects to a subscription stream and invokes an `onData` callback whenever a new event is received.",
        codeSnippet: `const PERSON_ADDED = gql\`\n  subscription {\n    personAdded {\n      name phone id\n    }\n  }\n\`;\nuseSubscription(PERSON_ADDED, {\n  onData: ({ data, client }) => {\n    const addedPerson = data.data.personAdded;\n    window.alert(\`New person added: \${addedPerson.name}\`);\n  }\n});`,
        mcq: {
          id: "q-8.6-4-v1",
          question: "How does a React component receive data pushed by a server subscription using `useSubscription`?",
          options: [
            { id: "A", text: "Via the `onData` callback option or the `{ data }` property returned by the hook" },
            { id: "B", text: "By reading from `document.cookie`" },
            { id: "C", text: "By listening to a DOM 'click' event" },
            { id: "D", text: "Through the component's `props.children`" }
          ],
          correctAnswer: "A",
          explanationNote: "`useSubscription` triggers `onData` whenever a message arrives and updates its returned `{ data }` state, triggering a component re-render."
        },
        retestMcq: {
          id: "q-8.6-4-v2",
          question: "What parameters are passed into the `onData` callback of `useSubscription` in modern Apollo Client?",
          options: [
            { id: "A", text: "An object containing `{ data, client }` allowing direct access to the incoming message and the cache" },
            { id: "B", text: "Only an HTTP status code integer" },
            { id: "C", text: "The entire server file directory" },
            { id: "D", text: "A canvas rendering context" }
          ],
          correctAnswer: "A",
          explanationNote: "`onData` receives `{ data, client }`, giving you the new event data and the Apollo Client instance to update the cache directly."
        }
      },
      {
        heading: "Updating Apollo Cache from Subscriptions",
        text: "When a subscription receives a new item, updating the cache with `client.cache.updateQuery` reflects the new item across the UI without duplicate items.",
        codeSnippet: `useSubscription(PERSON_ADDED, {\n  onData: ({ data, client }) => {\n    const newPerson = data.data.personAdded;\n    client.cache.updateQuery({ query: ALL_PERSONS }, ({ allPersons }) => {\n      const exists = allPersons.some(p => p.id === newPerson.id);\n      return exists ? { allPersons } : { allPersons: allPersons.concat(newPerson) };\n    });\n  }\n});`,
        mcq: {
          id: "q-8.6-5-v1",
          question: "Why should you check whether an item already exists in the cache before adding an item received via `useSubscription`?",
          options: [
            { id: "A", text: "To prevent duplicate entries if the current client was also the one that initiated the mutation" },
            { id: "B", text: "Because Apollo Client crashes if an array contains more than 10 items" },
            { id: "C", text: "Because GraphQL forbids arrays from containing objects" },
            { id: "D", text: "To verify that the database is running MongoDB" }
          ],
          correctAnswer: "A",
          explanationNote: "If the user who created the item already updated their local cache via mutation, receiving the subscription event could add a duplicate without an existence check."
        },
        retestMcq: {
          id: "q-8.6-5-v2",
          question: "What is the key takeaway of mastering Part 8 (GraphQL) in Full Stack Open?",
          options: [
            { id: "A", text: "A declarative, type-safe query language and runtime for building robust APIs with normalized caching and real-time streaming" },
            { id: "B", text: "That REST APIs can never be used under any circumstances" },
            { id: "C", text: "That databases must always be written in GraphQL SDL" },
            { id: "D", text: "That client applications no longer need React or JavaScript" }
          ],
          correctAnswer: "A",
          explanationNote: "GraphQL provides a complete, strongly-typed system for defining schemas, querying precise data, mutating state, and streaming live updates with Apollo Client."
        }
      }
    ]
  }
];

// Helper functions for student attempt tracking and failure streak logic
export const getLevelAttemptCountFullstackPart8 = (sectionId: string, studentId: string): number => {
  try {
    const key = `dopilot_fullstack_p8_attempt_${sectionId}_${studentId}`;
    const saved = localStorage.getItem(key);
    return saved ? Number(saved) : 1;
  } catch {
    return 1;
  }
};

export const setLevelAttemptCountFullstackPart8 = (sectionId: string, studentId: string, count: number): void => {
  try {
    const key = `dopilot_fullstack_p8_attempt_${sectionId}_${studentId}`;
    localStorage.setItem(key, String(count));
  } catch {}
};

export const getActiveQuestionsForLevelFullstackPart8 = (
  section: SectionContent,
  studentId: string,
  forceRetest: boolean = false
): McqQuestion[] => {
  const attempt = forceRetest ? 2 : getLevelAttemptCountFullstackPart8(section.id, studentId);
  return section.theoryBlocks.map((block) => {
    if (attempt >= 2 && block.retestMcq) {
      return block.retestMcq;
    }
    return block.mcq!;
  });
};

export const getConsecutiveFailedLevelsFullstackPart8 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_fullstack_p8_failed_levels_streak_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const isLevelLockedFullstackPart8 = (studentId: string): boolean => {
  try {
    return localStorage.getItem(`dopilot_fullstack_p8_locked_${studentId}`) === 'true';
  } catch {
    return false;
  }
};

export const recordLevelAttemptResultFullstackPart8 = (
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
  const currentAttempt = getLevelAttemptCountFullstackPart8(sectionId, studentId);

  if (isPassed) {
    try {
      localStorage.setItem(`dopilot_fullstack_p8_failed_levels_streak_${studentId}`, '0');
      localStorage.setItem(`dopilot_fullstack_p8_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_fullstack_p8_attempt_${sectionId}_${studentId}`, '1');
      localStorage.removeItem(`dopilot_fullstack_p8_locked_${studentId}`);
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
      setLevelAttemptCountFullstackPart8(sectionId, studentId, 2);
      const streak = getConsecutiveFailedLevelsFullstackPart8(studentId);

      return {
        isPassed: false,
        attemptCount: 1,
        isSecondFailureInLevel: false,
        consecutiveFailedLevels: streak,
        isLocked: false
      };
    } else {
      const prevStreak = getConsecutiveFailedLevelsFullstackPart8(studentId);
      const newStreak = prevStreak + 1;
      const isLocked = newStreak >= 3;

      try {
        localStorage.setItem(`dopilot_fullstack_p8_failed_levels_streak_${studentId}`, String(newStreak));
        localStorage.setItem(`dopilot_fullstack_p8_consecutive_failures_${studentId}`, String(newStreak));
        if (isLocked) {
          localStorage.setItem(`dopilot_fullstack_p8_locked_${studentId}`, 'true');
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

export const resetConsecutiveFailuresFullstackPart8 = (studentId: string): void => {
  try {
    localStorage.setItem(`dopilot_fullstack_p8_consecutive_failures_${studentId}`, '0');
    localStorage.setItem(`dopilot_fullstack_p8_failed_levels_streak_${studentId}`, '0');
    localStorage.removeItem(`dopilot_fullstack_p8_locked_${studentId}`);
  } catch {}
};
